const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

exports.createPost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const newPost = new Post({
      user: req.user.id,
      content: req.body.content,
      image: req.file ? req.file.path : null,
      visibility: req.body.visibility || 'public'
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ 
      $or: [
        { visibility: 'public' },
        { user: req.user.id },
        { 
          visibility: 'private', 
          user: { $in: req.user.following } 
        }
      ]
    }).sort('-createdAt').populate('user', 'username');

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    post.likes.push(req.user.id);
    await post.save();
    
    res.json(post.likes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};