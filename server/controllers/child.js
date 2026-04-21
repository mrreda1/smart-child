const handlerFactory = require('./handlerFactory');
const ParentModel = require('../models/Parent');
const ChildModel = require('../models/child');
const ParentChild = require('../models/parentChild');
const catchAsync = require('../utils/catchAsync');
const { StatusCodes } = require('http-status-codes');

const getChild = handlerFactory.getOne(ChildModel);

const getChildren = handlerFactory.getOneWithDeepPopulate(
  ParentModel,
  {
    generateFilter: (req) => ({
      _id: req.user.id,
    }),
    select: 'id',
  },
  {
    firstPath: 'children',
    firstMatch: { status: 'accepted' },
    secondPath: 'child_id',
  },
);

const updateChild = handlerFactory.updateOne(ChildModel, false);

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
  getChildren,
  getChild,
  updateChild,
  sendUpdateResponse,
  deleteChild,
  sendDeleteResponse,
};
