import express from 'express';
import Activity from '../models/Activity.js';
import Participation from '../models/Participation.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all activities (Public - excludes privateDetails)
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find().select('-privateDetails').populate('organizer', 'name email');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get my activities (Volunteer - includes privateDetails if accepted)
router.get('/my-activities', auth, async (req, res) => {
  try {
    console.log(`Fetching my activities for user: ${req.user.userId}`);
    const participations = await Participation.find({ volunteer: req.user.userId })
      .populate({
        path: 'activity',
        populate: { path: 'organizer', select: 'name email' }
      });
    console.log(`Found ${participations.length} participations`);

    const activities = participations.map(p => {
      const activity = p.activity.toObject();
      // Only show privateDetails if accepted
      if (p.status !== 'accepted') {
        delete activity.privateDetails;
      }
      return {
        ...activity,
        participationStatus: p.status // Include status for frontend convenience
      };
    });

    res.json(activities);
  } catch (error) {
    console.error('Error fetching my activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// JUAN: New endpoint for fetching created activities (Organization - includes privateDetails)
router.get('/created', auth, async (req, res) => {
  try {
    console.log('GET /created request from user:', req.user.userId);
    if (req.user.role !== 'organization') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const activities = await Activity.find({ organizer: req.user.userId })
      .populate('organizer', 'name email');
    console.log(`Found ${activities.length} created activities for user ${req.user.userId}`);
    res.json(activities);
  } catch (error) {
    console.error('Error fetching created activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create activity (Organization only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'organization') {
      return res.status(403).json({ message: 'Access denied. Organizations only.' });
    }

    const activity = new Activity({
      ...req.body,
      organizer: req.user.userId
    });

    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ message: 'Error creating activity' });
  }
});

// Update activity (Organization only)
router.put('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Check ownership
    // Ensure both are strings for comparison
    if (activity.organizer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied. You can only edit your own activities.' });
    }

    // Update fields
    const { title, description, date, duration, location, privateDetails, externalLink } = req.body;

    activity.title = title || activity.title;
    activity.description = description || activity.description;
    activity.date = date || activity.date;
    activity.duration = duration || activity.duration;
    activity.location = location || activity.location;
    // Allow empty string updates for optional fields
    if (privateDetails !== undefined) activity.privateDetails = privateDetails;
    if (externalLink !== undefined) activity.externalLink = externalLink;

    await activity.save();
    res.json(activity);
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join activity (Volunteer only)
router.post('/:id/join', auth, async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ message: 'Only volunteers can join activities' });
    }

    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Check if already joined
    const existingParticipation = await Participation.findOne({
      activity: req.params.id,
      volunteer: req.user.userId
    });

    if (existingParticipation) {
      return res.status(400).json({ message: 'Already joined this activity' });
    }

    const participation = new Participation({
      activity: req.params.id,
      volunteer: req.user.userId,
      status: 'pending',
      volunteerMessage: req.body.message || ''
    });

    await participation.save();
    
    // Add to activity participants array for backward compatibility if needed, 
    // but we should rely on Participation model now.
    activity.participants.push(req.user.userId);
    await activity.save();

    res.status(201).json(participation);
  } catch (error) {
    console.error('Error joining activity:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get participants for an activity (Organization only)
router.get('/:id/participants', auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Check ownership
    if (activity.organizer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    console.log(`Fetching participants for activity: ${req.params.id}`);
    const participations = await Participation.find({ activity: req.params.id })
      .populate('volunteer', 'name email bio');
    console.log(`Found ${participations.length} participations`);
    
    res.json(participations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update participation status (Organization only)
router.put('/participation/:id', auth, async (req, res) => {
  try {
    const { status, orgMessage } = req.body;
    const participation = await Participation.findById(req.params.id).populate('activity');
    
    if (!participation) {
      return res.status(404).json({ message: 'Participation not found' });
    }

    // Check ownership of the activity
    if (participation.activity.organizer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (status) participation.status = status;
    if (orgMessage) participation.orgMessage = orgMessage;

    await participation.save();
    res.json(participation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
