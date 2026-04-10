const express = require('express');
const router = express.Router();

const authController = require(`${__dirname}/../controllers/auth`);

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/verify-email', authController.verifyEmail);

router.post('/confirm-email/:token', authController.confirmEmail);

router.post('/forgotPassword', authController.forgotPassword);

router.patch('/resetPassword/:token', authController.resetPassword);

router
  .route('/updateMyPassword')
  .patch(authController.protect, authController.updatePassword);

module.exports = router;
