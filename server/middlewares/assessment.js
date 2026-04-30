const catchAsync = require('../utils/catchAsync');

const { AssessmentModel } = require('../models/index');
const AppError = require('../utils/appError');
const { StatusCodes } = require('http-status-codes/build/cjs');

const populateChildAssessment = (extractAssessmentId) =>
  catchAsync(async (req, res, next) => {
    const assessmentId = extractAssessmentId(req);

    const assessment = await AssessmentModel.findOne({ _id: assessmentId, child_id: req.child._id });

    if (!assessment)
      throw new AppError(`Assessment With id: ${assessmentId} not found for this child.`, StatusCodes.NOT_FOUND);

    req.assessment = assessment;

    next();
  });

module.exports = { populateChildAssessment };
