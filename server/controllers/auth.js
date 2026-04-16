const { promisify } = require('node:util');
const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/Parent');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const { StatusCodes } = require('http-status-codes');
const mailer = require('../utils/email');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  await createSendEmailVerificationToken(newUser);

  newUser.emailVerificationToken = undefined;

  createSendToken(newUser, StatusCodes.CREATED, res);
});

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return next(
      new AppError(
        'Please provide email and password',
        StatusCodes.BAD_REQUEST,
      ),
    );
  }

  const user = await User.findOne({ email: email }).select('+password');
  // const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (!(user && (await user.passwordMatch(password)))) {
    return next(
      new AppError('Email or password is incorrect!', StatusCodes.BAD_REQUEST),
    );
  }

  createSendToken(user, StatusCodes.OK, res);
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there

  let token = undefined;

  if (!req.headers.authorization?.startsWith('Bearer')) {
    return next(
      new AppError(
        "You're not logged in! Please log in to get access.",
        StatusCodes.UNAUTHORIZED,
      ),
    );
  }

  token = req.headers.authorization.split(' ')[1];
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does not exist.',
        StatusCodes.UNAUTHORIZED,
      ),
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'Password is recently changed! Please log in again.',
        StatusCodes.UNAUTHORIZED,
      ),
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE.
  req.user = currentUser.toObject();
  next();
});

exports.restrictToVerified = (req, res, next) => {
  if (!req.user.verifiedEmail) {
    return next(
      new AppError(
        'Your email is not verified. Please verify to access this feature.',
        StatusCodes.FORBIDDEN,
      ),
    );
  }

  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Permission denied.', StatusCodes.FORBIDDEN));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'token sent to email.',
    });
  }

  const expireTimeInMinutes = 60;
  const resetToken = user.createPasswordResetToken(expireTimeInMinutes);
  await user.save();

  await mailer.sendPasswordResetTokenEmail(
    user,
    resetToken,
    expireTimeInMinutes,
  );

  res.status(StatusCodes.OK).json({
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
    return next(
      new AppError('Token has expired or invalid!', StatusCodes.BAD_REQUEST),
    );
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, StatusCodes.OK, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  if (!(await user.passwordMatch(currentPassword))) {
    return next(
      new AppError('Current password is incorrect', StatusCodes.BAD_REQUEST),
    );
  }

  if (!(newPassword === newPasswordConfirm)) {
    return next(
      new AppError('New password does not match!', StatusCodes.BAD_REQUEST),
    );
  }

  if (currentPassword === newPassword)
    return next(
      new AppError(
        'New password is same as old password',
        StatusCodes.BAD_REQUEST,
      ),
    );

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;

  await user.save();

  createSendToken(user, StatusCodes.OK, res);
});

exports.confirmEmail = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
  });

  if (!user) {
    return next(new AppError('Token is invalid!', StatusCodes.BAD_REQUEST));
  }

  user.emailVerificationToken = undefined;
  user.verifiedEmail = true;
  await user.save();

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'email verified!',
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'token sent to email.',
    });
  }

  if (user.verifiedEmail)
    return next(
      new AppError('Email is already verified.', StatusCodes.CONFLICT),
    );

  await createSendEmailVerificationToken(user);

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'token sent to email.',
  });
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

const createSendEmailVerificationToken = async (user) => {
  const emailVerificationToken = user.createEmailVerificationToken();

  await user.save({ validateBeforeSave: false });

  mailer.sendEmailVerificationToken(user, emailVerificationToken);
};
