const { promisify } = require('node:util');
const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');
const User = require('./../models/user');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const mailer = require('../utils/email');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email: email }).select('+password');
  // const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (!(user && (await user.passwordMatch(password)))) {
    return next(new AppError('Email or password is incorrect!', 404));
  }

  createSendToken(user, 200, res);
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there

  let token = undefined;

  if (!req.headers.authorization?.startsWith('Bearer')) {
    return next(
      new AppError("You're not logged in! Please log in to get access.", 401),
    );
  }
  token = req.headers.authorization.split(' ')[1];
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does not exist.', 401),
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Password is recently changed! Please log in again.', 401),
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE.
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Permission denied.', 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with this email address.', 404));
  }

  const expireTimeInMinutes = 60;
  const resetToken = user.createPasswordResetToken(expireTimeInMinutes);
  await user.save();

  await mailer.sendPasswordResetTokenEmail(user, resetToken);

  res.status(200).json({
    status: 'success',
    message: 'token sent to email.',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token has expired or invalid!', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  if (!(await user.passwordMatch(currentPassword))) {
    return next(new AppError('Current password is incorrect', 401));
  }

  if (!(newPassword && newPasswordConfirm)) {
    return next(new AppError('New password does not match!', 401));
  }

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;

  await user.save();

  createSendToken(user, 200, res);
});

const createSendToken = (user, statusCode, res) => {
  const token = user.signToken();
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  };

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
