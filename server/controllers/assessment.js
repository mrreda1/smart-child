const { StatusCodes } = require('http-status-codes/build/cjs');
const catchAsync = require('../utils/catchAsync');

const AppError = require('../utils/appError');

const { evaluateMetrices, calculateStarDelta } = require('../utils/test');

const { AssessmentModel, AssessmentTestModel, TestModel } = require('../models/index');

const { evaluateAssessmentCompletion } = require('../utils/assessment');

const imageService = require('../services/ImageClassificationService');

const getAssignedAssessment = catchAsync(async (req, res, next) => {
  const assignedAssessment = await AssessmentModel.findOne({ child_id: req.child._id }).sort({ createdAt: -1 });

  if (!assignedAssessment) throw new AppError('No assessments found for this child.', StatusCodes.NOT_FOUND);

  res.json({ data: { assignedAssessment } });
});

const getAssessmentTests = catchAsync(async (req, res, next) => {
  const assessmentTests = await AssessmentTestModel.find({
    assessment_id: req.assessment._id,
    isCompleted: false,
  }).select('-assessment_id -rawData');

  res.json({ length: assessmentTests.length, data: { assessmentTests } });
});

const storeAsessmentTestResult = catchAsync(async (req, res, next) => {
  if (req.assessmentTest.isCompleted) throw new AppError('You have completed this test', StatusCodes.CONFLICT);

  if (req.assessmentTest.test_id.name === 'Drawing') await handleDrawingTestResult(req);
  else await handleTestsResult(req);

  const assessment = await AssessmentModel.findById(req.assessmentTest.assessment_id);

  if (!assessment) throw new AppError('Assessment not found', StatusCodes.NOT_FOUND);

  const assessmentState = await evaluateAssessmentCompletion(assessment, req.child);

  res.status(StatusCodes.OK).json({
    message: 'Test saved successfully',
    assessmentState,
  });
});

const handleDrawingTestResult = async (req) => {
  const assessmentTest = req.assessmentTest;

  if (!req.file) throw new AppError('Image field is required', StatusCodes.BAD_REQUEST);

  const { emotion } = await imageService.classifyImage(req.file);

  assessmentTest.rawData = { image: req.file.filename, emotion };

  assessmentTest.isCompleted = true;

  assessmentTest.results = evaluateMetrices(assessmentTest);

  const starDelta = calculateStarDelta(assessmentTest.results.difficultyAction, assessmentTest.difficulty, true);

  assessmentTest.starsEarned = starDelta;

  await assessmentTest.save();
};

const handleTestsResult = async (req) => {
  const assessmentTest = req.assessmentTest;

  req.body = JSON.parse(req.body.testData);

  if (Object.keys(req.body).length === 0) {
    throw new AppError('Test results cannot be empty.', StatusCodes.BAD_REQUEST);
  }

  const emptyProperty = Object.values(req.body).some((val) => !val && val !== 0 && val !== false);

  if (emptyProperty) throw new AppError("Test results shouldn't have empty data", StatusCodes.BAD_REQUEST);

  assessmentTest.rawData = req.body;
  assessmentTest.isCompleted = true;

  assessmentTest.results = evaluateMetrices(assessmentTest);

  const starDelta = calculateStarDelta(assessmentTest.results.difficultyAction, assessmentTest.difficulty);

  assessmentTest.starsEarned = starDelta;

  await assessmentTest.save();
};

module.exports = {
  getAssignedAssessment,
  getAssessmentTests,
  storeAsessmentTestResult,
};
