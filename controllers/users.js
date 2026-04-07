const User = require("./../models/user");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const filterObj = require("./../utils/filterObj");
const factory = require("./../controllers/handlerFactory");

exports.getUser = factory.getOne(User);

exports.deleteUser = factory.deleteOne(User);

exports.getAllUsers = factory.getMany(User);

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError("This route is not for user password updates.", 400),
    );
  }

  const filteredBody = filterObj(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.updateMyInfo = (req, res, next) => {
  const user = req.user;

  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("You cannot update password!", 400));
  }

  res.status(200).json({
    status: "success",
  });
};

exports.deleteMyAccount = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});
