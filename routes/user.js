const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const authController = require(`../controllers/auth`);

const setIdAsParam = require(`../middlewares/setIdAsParam.js`);

router.use('/me', authController.protect);

router
  .route('/me')
  .get(setIdAsParam('user'), userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteMyAccount);

router
  .route('/delete/:id')
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUser,
  );

router.route('/').get(userController.getAllUsers);

router.route('/:id').get(userController.getUser);

module.exports = router;
