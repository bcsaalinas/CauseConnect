import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

import User from '../models/User.js';
import Activity from '../models/Activity.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/causeconnect';

const run = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // 1. Create Org
    const org = new User({
      name: 'Debug Org',
      email: `debug_org_${Date.now()}@test.com`,
      password: 'password123',
      role: 'organization'
    });
    await org.save();
    console.log('✓ Org created:', org._id);

    // 2. Create Activity
    const activity = new Activity({
      title: 'Debug Activity',
      description: 'Debug Description',
      date: new Date(),
      duration: 2,
      location: 'Debug Location',
      organizer: org._id
    });
    await activity.save();
    console.log('✓ Activity created:', activity._id);

    // 3. Fetch Activities (Simulate GET /api/activities)
    const activities = await Activity.find().select('-privateDetails').populate('organizer', 'name email');
    console.log(`✓ Fetched ${activities.length} activities`);

    const fetchedActivity = activities.find(a => a._id.toString() === activity._id.toString());
    
    if (fetchedActivity) {
      console.log('✓ Activity found in DB');
      console.log('Organizer structure:', JSON.stringify(fetchedActivity.organizer, null, 2));
      
      const orgIdFromActivity = fetchedActivity.organizer._id.toString();
      const orgIdOriginal = org._id.toString();
      
      console.log(`Comparison: Activity Org ID (${orgIdFromActivity}) === Org ID (${orgIdOriginal}) ? ${orgIdFromActivity === orgIdOriginal}`);
      
      if (orgIdFromActivity === orgIdOriginal) {
        console.log('SUCCESS: IDs match.');
      } else {
        console.log('FAILURE: IDs do not match.');
      }
    } else {
      console.log('FAILURE: Activity not found in DB fetch.');
    }

    // Cleanup
    await User.deleteOne({ _id: org._id });
    await Activity.deleteOne({ _id: activity._id });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

run();
