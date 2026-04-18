const handlerFactory = require('./handlerFactory');
const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token');
const ChildModel = require('../models/child');
const ParentChild = require('../models/parentChild');
const catchAsync = require('../utils/catchAsync');
const { StatusCodes } = require('http-status-codes');
const path = require('path');
const { deleteFile } = require('../utils/files');
const AppError = require('../utils/appError');
const { sendChildLinkRequest } = require('../utils/email');
const { default: mongoose } = require('mongoose');

const createChild = catchAsync(async (req, res, next) => {
  const parentId = req.user.id;

  const newChild = await ChildModel.create(req.body);

  await ParentChild.create({
    parent_id: parentId,
    child_id: newChild._id,
    is_owner: true,
    status: 'accepted',
  });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      child: newChild,
    },
  });
});

const getChild = handlerFactory.getOne(ChildModel);

const updateChild = handlerFactory.updateOne(ChildModel, false);

const sendUpdateResponse = async (req, res, next) => {
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      child: req.newChild,
    },
  });
};

const deleteChild = handlerFactory.deleteOne(ChildModel, false);

const sendDeleteResponse = async (req, res, next) => {
  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    data: null,
  });
};

module.exports = {
  createChild,
  getChild,
  updateChild,
  sendUpdateResponse,
  deleteChild,
  sendDeleteResponse,
};
