const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');
const Parent = require('../models/parent');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const { StatusCodes } = require('http-status-codes');
const mailer = require('../utils/email');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await Parent.create({
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
    return next(new AppError('Please provide email and password', StatusCodes.BAD_REQUEST));
  }

  const user = await Parent.findOne({ email: email }).select('+password');
  // const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (!(user && (await user.passwordMatch(password)))) {
    return next(new AppError('Email or password is incorrect!', StatusCodes.BAD_REQUEST));
  }

  createSendToken(user, StatusCodes.OK, res);
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await Parent.findOne({ email: req.body.email });
  if (!user) {
    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'token sent to email.',
    });
  }

  const expireTimeInMinutes = 60;
  const resetToken = user.createPasswordResetToken(expireTimeInMinutes);
  await user.save();

  await mailer.sendPasswordResetTokenEmail(user, resetToken, expireTimeInMinutes);

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'token sent to email.',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await Parent.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token has expired or invalid!', StatusCodes.BAD_REQUEST));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, StatusCodes.OK, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await Parent.findById(req.user.id).select('+password');
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  if (!(await user.passwordMatch(currentPassword))) {
    throw new AppError('Current password is incorrect', StatusCodes.BAD_REQUEST);
  }

  if (!(newPassword === newPasswordConfirm)) {
    throw new AppError('New password does not match!', StatusCodes.BAD_REQUEST);
  }

  if (currentPassword === newPassword)
    throw new AppError('New password is same as old password', StatusCodes.BAD_REQUEST);

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;

  await user.save();

  createSendToken(user, StatusCodes.OK, res);
});

exports.confirmEmail = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await Parent.findOne({
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
  const user = await Parent.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'token sent to email.',
    });
  }

  if (user.verifiedEmail) return next(new AppError('Email is already verified.', StatusCodes.CONFLICT));

  await createSendEmailVerificationToken(user);

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'token sent to email.',
  });
});

exports.switchToChild = catchAsync(async (req, res, next) => {
  const { child_id: childId, parent_id } = req.parentChildLink;
  const parent = req.user;

  const token = jwt.sign(
    { childId, parent: { id: parent.id, name: parent.name }, role: 'child' },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    },
  );

  res.json({
    status: 'success',
    token,
  });
});

exports.switchToParent = catchAsync(async (req, res, next) => {
  const { parent } = req;

  const isPassMatch = await parent.passwordMatch(req.body.password);

  if (!isPassMatch) throw new AppError('Wrong password', StatusCodes.UNAUTHORIZED);

  createSendToken(parent, StatusCodes.OK, res);
});

const createSendToken = (parent, statusCode, res) => {
  const token = parent.signToken();

  parent.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      parent,
    },
  });
};

const createSendEmailVerificationToken = async (parent) => {
  const emailVerificationToken = parent.createEmailVerificationToken();

  await parent.save({ validateBeforeSave: false });

  mailer.sendEmailVerificationToken(parent, emailVerificationToken);
};
