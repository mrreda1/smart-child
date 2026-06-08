const router = require('express').Router();

const authMiddleware = require('../middlewares/auth');

const chatSessionController = require('../controllers/chatSession');

router.use(authMiddleware.protect);

router.post(
  '/',
  (req, res, next) => {
    req.body.parentId = req.user._id;

    console.log(req.body);

    next();
  },
  chatSessionController.createSession,
);

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
