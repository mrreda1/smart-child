const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error');

const authRouter = require(`${__dirname}/routes/auth`);
const userRouter = require(`${__dirname}/routes/user`);
const childRouter = require(`${__dirname}/routes/child`);
const coparentRouter = require(`${__dirname}/routes/coparent`);

const setupMiddlewares = require(`${__dirname}/utils/middlewares`);

const express = require('express');
const { cleanupReqFile } = require('./middlewares/cleanupReqFile');

const APIVersion = '1';
const app = express();

// MIDDLEWARE
setupMiddlewares(app);

// ROUTES
app.use(`/api/v${APIVersion}/auth`, authRouter);

app.use(`/api/v${APIVersion}/user`, userRouter);

app.use(`/api/v${APIVersion}/child`, childRouter);

app.use(`/api/v${APIVersion}/coparent`, coparentRouter);

// Error handler for invalid routes
app.all('*', (req, res, next) => {
  const err = new AppError(
    `can't find ${req.originalUrl} on this server!`,
    404,
  );

  next(err);
});

app.use(cleanupReqFile, globalErrorHandler);

module.exports = app;
