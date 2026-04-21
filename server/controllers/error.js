const { StatusCodes } = require('http-status-codes');
const AppError = require('./../utils/appError');
const files = require('../utils/files');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, StatusCodes.BAD_REQUEST);
};

const handleDuplicateKeyNameDB = (err) => {
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field value '${value}'.`;

  return new AppError(message, StatusCodes.BAD_REQUEST);
};

const handleFileLimitError = (err) => {
  return new AppError(
    `Maximum file size is ${process.env.MAX_FILE_SIZE_MB}mb`,
    StatusCodes.BAD_REQUEST,
  );
};

const handleValidationErrorDB = (err) => {
  return new AppError(err.message, StatusCodes.BAD_REQUEST);
};

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(err);

    res.status(err.statusCode).json({
      status: err.status,
      message: 'Something went wrong!',
    });
  }
};

const handleJWTError = (err) =>
  new AppError('Invalid token. Please log in again!', StatusCodes.UNAUTHORIZED);

const simplifyError = (err) => {
  const duplicateKeyErrorCodeDB = 11000;
  if (err.name === 'CastError') {
    return handleCastErrorDB(err);
  }
  if (err.code === duplicateKeyErrorCodeDB) {
    return handleDuplicateKeyNameDB(err);
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return handleFileLimitError(err);
  }
  if (err.name === 'ValidationError') {
    return handleValidationErrorDB(err);
  }
  if (err.name === 'JsonWebTokenError') {
    return handleJWTError(err);
  }
  if (err.name === 'TokenExpiredError') {
    return new AppError(
      'Session expired. Please log in again!',
      StatusCodes.UNAUTHORIZED,
    );
  }
  return err;
};

module.exports = async (err, req, res, next) => {
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else {
    const userErr = simplifyError(err);
    sendErrProd(userErr, res);
  }
};
