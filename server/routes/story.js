const router = require('express').Router();

const storyController = require('../controllers/story');

router.get('/', storyController.getStories);

module.exports = router;
