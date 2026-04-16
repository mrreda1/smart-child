const router = require('express').Router();

const childController = require('../controllers/child');
const authController = require('../controllers/auth');

const upload = require('../middlewares/upload');

const { populateFileToBody } = require('../middlewares/populateFileToBody');

const {
  checkParentChildLink,
  checkParentChildOwnership,
} = require('../middlewares/parentChild');

const { cleanupOldFile } = require('../middlewares/cleanupOldFile');

router.use(authController.protect);

router.post(
  '/',
  upload.single('photo'),
  populateFileToBody({ propertyName: 'photo' }),
  childController.createChild,
);

router
  .route('/:id')

  .all(checkParentChildLink)

  .get(childController.getChild)

  .all(checkParentChildOwnership)

  .patch(
    upload.single('photo'),
    populateFileToBody({ propertyName: 'photo', optional: true }),
    childController.updateChild,
    cleanupOldFile('child', 'photo'),
    childController.sendUpdateResponse,
  )
  .delete(childController.deleteChild, childController.sendDeleteResponse);

module.exports = router;
