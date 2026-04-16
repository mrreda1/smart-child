const User = require('../models/Parent');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');
const factory = require('./handlerFactory');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs/promises');

exports.getUser = factory.getOne(User);

exports.deleteUser = factory.deleteOne(User);

exports.getAllUsers = factory.getMany(User);

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for user password updates.',
        StatusCodes.BAD_REQUEST,
      ),
    );
  }

  const currentUser = await User.findById(req.user.id);

  if (req.file) {
    if (currentUser.photo && currentUser.photo !== 'default-user.jpg') {
      const oldPath = `${__dirname}/../uploads/profiles/${currentUser.photo}`;

      await fs.unlink(oldPath); // Remove Old Photo
    }

    req.body.photo = req.file.filename;
  }

  const filteredBody = filterObj(req.body, 'name', 'photo');

  Object.keys(filteredBody).forEach((el) => {
    currentUser[el] = filteredBody[el];
  });

  const updatedUser = await currentUser.save({ validateBeforeSave: true });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMyAccount = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    data: null,
  });
});
