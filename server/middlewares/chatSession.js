const mongoose = require('mongoose');
const { ChatSessionModel, ChildModel } = require('../models/index');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { StatusCodes } = require('http-status-codes');

const ensureChatSession = catchAsync(async (req, res, next) => {
  const { sessionId, childId, message } = req.body;

  const child = await ChildModel.findById(childId);

  if (!child) throw new AppError('Child not found or has beed deleted.', StatusCodes.NOT_FOUND);

  req.child = child;

  if (sessionId) {
    const existingSession = await ChatSessionModel.findById(sessionId);

    if (!existingSession || !existingSession.childId.equals(child._id))
      throw new AppError('Chat session not found or not for that child.', StatusCodes.NOT_FOUND);

    return next();
  }

  if (!message) throw new AppError('Can not create session for empty message', StatusCodes.BAD_REQUEST);

  const newSession = await ChatSessionModel.create({
    parentId: req.user._id,
    childId,
    topic: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
  });

  req.body.sessionId = newSession._id;

  next();
});

module.exports = { ensureChatSession };
