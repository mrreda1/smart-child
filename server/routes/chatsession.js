const router = require('express').Router();

const authMiddleware = require('../middlewares/auth');

const chatSessionController = require('../controllers/chatSession');

router.use(authMiddleware.protect);

router.get(
  '/',
  (req, res, next) => {
    req.query.parentId = req.user._id;
    next();
  },
  chatSessionController.getSessions,
);

router.delete('/:id', chatSessionController.deleteSession);

module.exports = router;
