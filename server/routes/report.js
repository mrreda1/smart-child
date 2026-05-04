const router = require('express').Router();

const reportController = require('../controllers/report');
const authMiddleware = require('../middlewares/auth');
const parentChildMiddleware = require('../middlewares/parentChild');

router.use(authMiddleware.protect);

router.get(
  '/daily/:childId',
  parentChildMiddleware.checkParentChildLink((req) => req.params.childId),
  reportController.getDailyReports,
);

module.exports = router;
