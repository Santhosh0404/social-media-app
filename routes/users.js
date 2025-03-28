const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getUserProfile, followUser } = require('../controllers/userController');

router.get('/:id', protect, getUserProfile);
router.post('/:id/follow', protect, followUser);

module.exports = router;