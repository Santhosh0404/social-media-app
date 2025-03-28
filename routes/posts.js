const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createPost, getPosts, likePost } = require('../controllers/postController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/', protect, upload.single('image'), createPost);
router.get('/', protect, getPosts);
router.put('/:id/like', protect, likePost);

module.exports = router;