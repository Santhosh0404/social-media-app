const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers following', 'username');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check profile visibility
    if (user.profileVisibility === 'private' && 
        !user.followers.includes(req.user.id) && 
        req.user.id !== user._id.toString()) {
      return res.status(403).json({ message: 'Private profile' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ message: 'Already following' });
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    res.json({ message: 'Followed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};