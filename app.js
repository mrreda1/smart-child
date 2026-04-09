const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error');

const userRouter = require(`${__dirname}/routes/users`);

const setupMiddlewares = require(`${__dirname}/utils/middlewares`);

const express = require('express');

const APIVersion = '1';
const app = express();

// MIDDLEWARE
setupMiddlewares(app);

// ROUTES
app.use(`/api/v${APIVersion}/users`, userRouter);

// Error handler for invalid routes
app.all('*', (req, res, next) => {
  const err = new AppError(
    `can't find ${req.originalUrl} on this server!`,
    404,
  );

  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
