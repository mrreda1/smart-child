const mongoose = require('mongoose');
const { ChatSessionModel, ChildModel } = require('../models/index');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { StatusCodes } = require('http-status-codes');

const ensureChatSession = catchAsync(async (req, res, next) => {
  const { sessionId, childId, message } = req.body;

  if (!message) throw new AppError('Message cannot be empty.', StatusCodes.BAD_REQUEST);

  const child = await ChildModel.findById(childId);

  if (!child) throw new AppError('Child not found or has been deleted.', StatusCodes.NOT_FOUND);

  req.child = child;

  const existingSession = await ChatSessionModel.findById(sessionId);

  if (!existingSession || !existingSession.childId.equals(child._id))
    throw new AppError('Chat session not found or not for that child.', StatusCodes.NOT_FOUND);

  req.chatSession = existingSession;

  next();
});

module.exports = { ensureChatSession };
