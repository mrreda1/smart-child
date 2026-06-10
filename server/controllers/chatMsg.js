const { StatusCodes } = require('http-status-codes/build/cjs');
const { ChatMessageModel, ChatSessionModel, OverallReportModel } = require('../models/index');
const catchAsync = require('../utils/catchAsync');
const { cleanStreamText } = require('../utils/text');
const AppError = require('../utils/appError');
const { formatOverallReport } = require('../utils/report');
const chatbotService = require('../services/chatbotService');
const handlerFactory = require('./handlerFactory');
const mongoose = require('mongoose');

const getMsgs = handlerFactory.getMany(ChatMessageModel);

const sendMsg = catchAsync(async (req, res, next) => {
  const { message, sessionId } = req.body;
  let { stream: isStream = 'true' } = req.query;

  isStream = isStream === 'true';

  const userMsgId = new mongoose.Types.ObjectId();
  const aiMsgId = new mongoose.Types.ObjectId();

  const history = (await ChatMessageModel.find({ sessionId }).sort('-createdAt').limit(10)).reverse(); // Last 10 msgs

  // --- Use the propagated session object to update the topic ---
  if (history.length === 0) {
    req.chatSession.topic = message.substring(0, 30) + (message.length > 30 ? '...' : '');
    await req.chatSession.save(); // Saves the modification directly
  }
  // ------------------------------------------------------------------------

  await ChatMessageModel.create({
    _id: userMsgId,
    sessionId,
    sender: 'parent',
    content: message,
  });

  const formattedHistory = history.map((msg) => ({
    role: msg.sender === 'parent' ? 'user' : 'assistant',
    content: msg.content,
  }));

  const overallReport = (await OverallReportModel.findOne({ child_id: req.child._id }))?.toObject();
  const formattedReport = formatOverallReport(overallReport);

  const aiPayload = {
    childName: req.child.name,
    age: req.child.age,
    message: message,
    report: formattedReport,
    history: formattedHistory,
  };

  const response = await chatbotService.chat(aiPayload, isStream);

  if (isStream) {
    handleStreamResponse(res, response, sessionId, userMsgId, aiMsgId);
  } else {
    await handleJsonResponse(res, response, sessionId);
  }
});

const handleStreamResponse = (res, response, sessionId, userMsgId, aiMsgId) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Expose-Headers', 'X-User-Msg-Id, X-AI-Msg-Id');

  res.setHeader('X-User-Msg-Id', userMsgId.toString());
  res.setHeader('X-AI-Msg-Id', aiMsgId.toString());

  let fullAiMessage = '';

  response.data.on('data', (chunk) => {
    const textChunk = chunk.toString();
    const cleanChunk = cleanStreamText(textChunk);
    fullAiMessage += cleanChunk;
    res.write(textChunk);
  });

  response.data.on('end', async () => {
    try {
      if (fullAiMessage.trim()) {
        await ChatMessageModel.create({
          _id: aiMsgId,
          sessionId,
          sender: 'AI',
          content: fullAiMessage.trim(),
        });
      }
    } catch (dbError) {
      console.error('Failed to save streamed message to DB:', dbError.message);
    }
    res.end();
  });

  response.data.on('error', (err) => {
    console.error('Stream error:', err.message);
    res.write('\n[Error: Stream disconnected]');
    res.end();
  });
};

const handleJsonResponse = async (res, response, sessionId) => {
  const aiReplyText = response.data.reply;
  await ChatMessageModel.create({ sessionId, sender: 'AI', content: aiReplyText });
  return res.status(StatusCodes.OK).json(response.data);
};

module.exports = { sendMsg, getMsgs };
