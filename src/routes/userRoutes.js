import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user bookmarks
router.get('/bookmarks', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('bookmarks');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// JUAN: Endpoint to save bookmarks (works for both GG and Mexican NGOs)
router.post('/bookmarks', auth, async (req, res) => {
  try {
    const { projectId, title, imageUrl } = req.body;
    
    if (!projectId || !title) {
      return res.status(400).json({ message: 'Project ID and Title are required' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if already bookmarked
    const isBookmarked = user.bookmarks.some(b => b.projectId === projectId.toString());
    if (isBookmarked) {
      return res.status(400).json({ message: 'Project already bookmarked' });
    }

    user.bookmarks.push({ projectId, title, imageUrl });
    await user.save();

    res.status(201).json(user.bookmarks);
  } catch (error) {
    console.error('Error adding bookmark:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove bookmark
router.delete('/bookmarks/:projectId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.bookmarks = user.bookmarks.filter(b => b.projectId !== req.params.projectId);
    await user.save();

    res.json(user.bookmarks);
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
