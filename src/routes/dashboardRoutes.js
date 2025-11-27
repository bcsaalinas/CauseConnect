import express from 'express';
import auth from '../middleware/auth.js';
import Activity from '../models/Activity.js';
import Participation from '../models/Participation.js';

const router = express.Router();

// Get dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;
    
    let stats = {};

    if (role === 'volunteer') {
      // Volunteer Stats
      const participations = await Participation.find({ 
        volunteer: userId, 
        status: 'accepted' 
      }).populate('activity');

      const hoursVolunteered = participations.reduce((acc, p) => acc + (p.activity.duration || 0), 0);
      
      // Unique causes (organizations) supported
      const uniqueOrgs = new Set(participations.map(p => p.activity.organizer.toString()));
      
      // Active participations (pending or accepted future activities)
      const activeParticipationsCount = await Participation.countDocuments({
        volunteer: userId,
        status: { $in: ['pending', 'accepted'] }
      });

      // Recent Activity (last 5 participations)
      const recentActivity = await Participation.find({ volunteer: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('activity', 'title date');

      stats = {
        hoursVolunteered,
        causesSupported: uniqueOrgs.size,
        activeParticipations: activeParticipationsCount,
        recentActivity
      };

    } else if (role === 'organization') {
      // Organization Stats
      const myActivities = await Activity.find({ organizer: userId });
      const activityIds = myActivities.map(a => a._id);

      const participations = await Participation.find({
        activity: { $in: activityIds },
        status: 'accepted'
      }).populate('activity');

      // Active Volunteers (unique volunteers accepted)
      const uniqueVolunteers = new Set(participations.map(p => p.volunteer.toString()));

      // Impact Hours Created (sum of duration * participants)
      const impactHours = participations.reduce((acc, p) => acc + (p.activity.duration || 0), 0);

      // Donations Received (Placeholder 0 as we removed donations)
      const donationsReceived = 0; 

      // Recent Subscribers (last 5 unique volunteers)
      const recentParticipations = await Participation.find({
        activity: { $in: activityIds }
      })
      .sort({ createdAt: -1 })
      .populate('volunteer', 'name email createdAt')
      .populate('activity', 'title');

      // Deduplicate volunteers
      const recentSubscribers = [];
      const seenVolunteers = new Set();
      for (const p of recentParticipations) {
        if (!seenVolunteers.has(p.volunteer._id.toString())) {
          seenVolunteers.add(p.volunteer._id.toString());
          recentSubscribers.push({
            _id: p.volunteer._id,
            name: p.volunteer.name,
            email: p.volunteer.email,
            joinedAt: p.createdAt, // using participation date as "joined" date for this context
            activityTitle: p.activity.title
          });
        }
        if (recentSubscribers.length >= 5) break;
      }

      stats = {
        donationsReceived,
        activeVolunteers: uniqueVolunteers.size,
        impactHoursCreated: impactHours,
        recentSubscribers
      };
    }

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
