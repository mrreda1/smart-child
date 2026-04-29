const { StatusCodes } = require('http-status-codes/build/cjs');
const catchAsync = require('../utils/catchAsync');

const AssessmentModel = require('../models/assessment');
const AssessmentTestModel = require('../models/assessmentTest');

const AppError = require('../utils/appError');
const assessmentTest = require('../models/assessmentTest');

const getAssignedAssessment = catchAsync(async (req, res, next) => {
  const assignedAssessment = await AssessmentModel.findOne({ child_id: req.child._id }).sort({ created_at: -1 });

  if (!assignedAssessment) throw new AppError('No assessments found for this child.', StatusCodes.NOT_FOUND);

  res.json({ data: { assignedAssessment } });
});

const getAssessmentTests = catchAsync(async (req, res, next) => {
  const { assessmentId } = req.params;

  const assessment = await AssessmentModel.findOne({ _id: assessmentId, child_id: req.child._id });

  if (!assessment)
    throw new AppError(`Assessment With id: ${assessmentId} not found for this child.`, StatusCodes.NOT_FOUND);

  const assessmentTests = await AssessmentTestModel.find({ assessment_id: assessment._id, isCompleted: false }).select(
    '-assessment_id -rawData',
  );

  res.json({ length: assessmentTests.length, data: { assessmentTests } });
});

const storeAsessmentTestResult = catchAsync(async (req, res, next) => {
  if (req.assessmentTest.isCompleted) throw new AppError('You have completed this test', StatusCodes.CONFLICT);

  if (req.file) return await handleDrawingTestResult(req, res, next);
  else return await handleTestsResult(req, res, next);
});

const handleDrawingTestResult = async (req, res, next) => {
  const assessmentTest = req.assessmentTest;

  assessmentTest.rawData = { image: req.file.filename };
  assessmentTest.isCompleted = true;

  await assessmentTest.save();

  res.sendStatus(StatusCodes.OK);
};

const handleTestsResult = async (req, res, next) => {
  const assessmentTest = req.assessmentTest;

  if (Object.keys(req.body).length === 0) throw new AppError('Test results cannot be empty.', StatusCodes.BAD_REQUEST);

  const emptyProperty = Object.values(req.body).some((val) => !val && val !== 0 && val !== false);

  if (emptyProperty) throw new AppError("Test results shoudn't have empty data", StatusCodes.BAD_REQUEST);

  assessmentTest.rawData = req.body;
  assessmentTest.isCompleted = true;

  await assessmentTest.save();

  res.sendStatus(StatusCodes.OK);
};

module.exports = { getAssignedAssessment, getAssessmentTests, storeAsessmentTestResult };
