const router = require('express').Router();

const childController = require('../controllers/child');
const authMiddleware = require('../middlewares/auth');
const parentChecksMiddleware = require('../middlewares/parentChecks');

const upload = require('../middlewares/upload');

const { populateFileToBody } = require('../middlewares/populateFileToBody');

const { checkParentChildLink, checkParentChildOwnership } = require('../middlewares/parentChild');

const { cleanupOldFile } = require('../middlewares/cleanupOldFile');

router.use(authMiddleware.protect);

router.post(
  '/',
  upload.single('photo'),
  populateFileToBody({ propertyName: 'photo' }),
  parentChecksMiddleware.restrictToVerified,
  childController.createChild,
);

router.get('/', childController.getChildren);

router
  .route('/:id')

  .all(checkParentChildLink((req) => req.params.id))

  .get(childController.getChild)

  .all(checkParentChildOwnership((req) => req.parentChildLink))

  .patch(
    upload.single('photo'),
    populateFileToBody({ propertyName: 'photo', optional: true }),
    childController.updateChild,
    cleanupOldFile('child', 'photo'),
    childController.sendUpdateResponse,
  )
  .delete(childController.deleteChild, childController.sendDeleteResponse);

module.exports = router;
