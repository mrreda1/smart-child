const router = require('express').Router();

const assessmentController = require('../controllers/assessment');
const assessmentTestMiddleware = require('../middlewares/assessmentTest');

const auth = require('../middlewares/auth');

router.use(auth.protectChild);

router.get('/assigned', assessmentController.getAssignedAssessment);

router.get('/:assessmentId/tests', assessmentController.getAssessmentTests);

router.post(
  '/test/:assessmentTestId',
  assessmentTestMiddleware.checkAssessmentTestAuthority((req) => req.params.assessmentTestId),
  assessmentController.storeAsessmentTestResult,
);

module.exports = router;
