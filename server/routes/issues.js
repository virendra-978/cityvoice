import express from 'express';
import Issue from '../models/Issue.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all issues
router.get('/', auth, async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('reportedBy', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new issue
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, location, images } = req.body;
    const issue = new Issue({
      title,
      description,
      location,
      images,
      reportedBy: req.user.userId
    });
    await issue.save();
    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update issue status (admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
export default router;