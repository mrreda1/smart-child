const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const { promisify } = require('node:util');
const { StatusCodes } = require('http-status-codes/build/cjs');
const Parent = require('../models/Parent');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
  let token = undefined;

  if (!req.headers.authorization?.startsWith('Bearer'))
    throw new AppError("You're not logged in! Please log in to get access.", StatusCodes.UNAUTHORIZED);

  token = req.headers.authorization.split(' ')[1];

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await Parent.findById(decoded.id);

  if (!currentUser) throw new AppError('The user belonging to this token does not exist.', StatusCodes.UNAUTHORIZED);

  if (currentUser.changedPasswordAfter(decoded.iat))
    throw new AppError('Password is recently changed! Please log in again.', StatusCodes.UNAUTHORIZED);

  // GRANT ACCESS TO PROTECTED ROUTE.
  req.user = currentUser.toObject();
  next();
});

module.exports = { protect };
