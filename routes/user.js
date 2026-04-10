const express = require('express');
const router = express.Router();

const userController = require(`${__dirname}/../controllers/user`);
const authController = require(`${__dirname}/../controllers/auth`);

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
