const catchAsync = require('../utils/catchAsync');
const ParentChild = require('../models/parentChild');
const AppError = require('../utils/appError');
const { StatusCodes } = require('http-status-codes');

const checkParentChildLink = (extractChildId) =>
  catchAsync(async (req, res, next) => {
    const childId = extractChildId(req);

    const parentId = req.user.id;

    const relationship = await ParentChild.findOne({
      parent_id: parentId,
      child_id: childId,
    });

    if (!relationship)
      throw new AppError('Forbidden: You do not have permission to access this child profile.', StatusCodes.FORBIDDEN);

    req.parentChildLink = relationship.toObject();

    next();
  });

const checkParentChildOwnership = (extractRelationship) =>
  catchAsync(async (req, res, next) => {
    const parentChildLink = extractRelationship(req);

    if (!parentChildLink?.is_owner)
      throw new AppError(
        'Forbidden: You do not have permission to do that action. only owner parent can do.',
        StatusCodes.FORBIDDEN,
      );

    next();
  });

module.exports = { checkParentChildLink, checkParentChildOwnership };
