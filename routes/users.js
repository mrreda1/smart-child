const express = require('express');
const userController = require(`${__dirname}/../controllers/users`);
const authController = require(`${__dirname}/../controllers/auth`);

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router
  .route('/updateMyPassword')
  .patch(authController.protect, authController.updatePassword);
router
  .route('/updateMyInfo')
  .patch(authController.protect, userController.updateUser);
router
  .route('/deleteMyAccount')
  .delete(authController.protect, userController.deleteMyAccount);
router
  .route('/delete/:id')
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUser,
  );

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
