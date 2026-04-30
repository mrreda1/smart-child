const { StatusCodes } = require('http-status-codes/build/cjs');
const catchAsync = require('../utils/catchAsync');

const AssessmentModel = require('../models/assessment');
const AssessmentTestModel = require('../models/assessmentTest');

const AppError = require('../utils/appError');
const assessmentTest = require('../models/assessmentTest');

const { evaluateMetrices, calculateStarDelta } = require('../utils/test');

const getAssignedAssessment = catchAsync(async (req, res, next) => {
  const assignedAssessment = await AssessmentModel.findOne({ child_id: req.child._id }).sort({ created_at: -1 });

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

  if (req.file) return await handleDrawingTestResult(req, res, next);
  else return await handleTestsResult(req, res, next);
});

const handleDrawingTestResult = async (req, res, next) => {
  const assessmentTest = req.assessmentTest;

  assessmentTest.rawData = { image: req.file.filename };
  assessmentTest.isCompleted = true;

  assessmentTest.results = evaluateMetrices(assessmentTest);

  const starDelta = calculateStarDelta(assessmentTest.results.difficultyAction, assessmentTest.difficulty, true);

  assessmentTest.starsEarned = starDelta;

  await assessmentTest.save();

  res.sendStatus(StatusCodes.OK);
};

const handleTestsResult = async (req, res, next) => {
  const assessmentTest = req.assessmentTest;

  req.body = JSON.parse(req.body.testData);

  if (Object.keys(req.body).length === 0) {
    throw new AppError('Test results cannot be empty.', StatusCodes.BAD_REQUEST);
  }

  const emptyProperty = Object.values(req.body).some((val) => !val && val !== 0 && val !== false);

  if (emptyProperty) {
    throw new AppError("Test results shouldn't have empty data", StatusCodes.BAD_REQUEST);
  }

  assessmentTest.rawData = req.body;
  assessmentTest.isCompleted = true;

  assessmentTest.results = evaluateMetrices(assessmentTest);

  const starDelta = calculateStarDelta(assessmentTest.results.difficultyAction, assessmentTest.difficulty);

  assessmentTest.starsEarned = starDelta;

  await assessmentTest.save();

  res.sendStatus(StatusCodes.OK);
};
const completeAssesment = catchAsync(async (req, res, next) => {
  const assessment = req.assessment;
  const child = req.child;

  if (assessment.status === 'completed') throw new AppError('Assessment Is Already Completed', StatusCodes.CONFLICT);

  const assessmentTests = await AssessmentTestModel.find({
    assessment_id: req.assessment._id,
  }).select('-assessment_id');

  if (assessmentTests.length === 0) throw new AppError('No Tests Associated To This Assessment', StatusCodes.NOT_FOUND);

  if (!assessmentTests.every((e) => e.isCompleted))
    throw new AppError('All Tests Of That Assessment Should be Completed First', StatusCodes.CONFLICT);

  const TotalStarsEarned = assessmentTests.reduce((acc, assessmentTest) => acc + assessmentTest.starsEarned, 0);

  assessment.status = 'completed';
  child.num_of_stars = Math.max(0, child.num_of_stars + TotalStarsEarned);

  await assessment.save();
  await child.save();

  res.json({ data: { TotalStarsEarned } });
});

module.exports = { getAssignedAssessment, getAssessmentTests, storeAsessmentTestResult, completeAssesment };
