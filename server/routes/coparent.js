const router = require('express').Router();

const coparentController = require('../controllers/coparent');

const authMiddleware = require('../middlewares/auth');
const parentChecksMiddleware = require('../middlewares/parentChecks');
const parentChildMiddleware = require('../middlewares/parentChild');
const tokenMiddleware = require('../middlewares/token');

router.use(authMiddleware.protect);

router.post(
  '/',
  parentChecksMiddleware.restrictToVerified,
  parentChildMiddleware.populateChildPrimaryParent,
  coparentController.requestCoParentAccess,
);

router.patch(
  '/:token',
  tokenMiddleware.resolveCoparentToken((req) => req.params.token),
  parentChildMiddleware.checkParentChildLink((req) => req.pendingLink.child_id),
  parentChildMiddleware.checkParentChildOwnership((req) => req.parentChildLink),
  coparentController.replyCoParentAcess,
);

module.exports = router;
