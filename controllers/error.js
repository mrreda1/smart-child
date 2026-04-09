const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateKeyNameDB = (err) => {
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field value '${value}'.`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  return new AppError(err.message, 400);
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
  new AppError('Invalid token. Please log in again!', 401);

const simplifyError = (err) => {
  const duplicateKeyErrorCodeDB = 11000;
  if (err.name === 'CastError') {
    return handleCastErrorDB(err);
  }
  if (err.code === duplicateKeyErrorCodeDB) {
    return handleDuplicateKeyNameDB(err);
  }
  if (err.name === 'ValidationError') {
    return handleValidationErrorDB(err);
  }
  if (err.name === 'JsonWebTokenError') {
    return handleJWTError(err);
  }
  if (err.name === 'TokenExpiredError') {
    return new AppError('Session expired. Please log in again!', 401);
  }
  return err;
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else {
    const userErr = simplifyError(err);
    sendErrProd(userErr, res);
  }
};
