import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

import User from '../models/User.js';
import Activity from '../models/Activity.js';
import Participation from '../models/Participation.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/causeconnect';

const run = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // 1. Create Org
    const org = new User({
      name: 'Test Org',
      email: `org_${Date.now()}@test.com`,
      password: 'password123',
      role: 'organization'
    });
    await org.save();
    console.log('✓ Org created:', org._id);

    // 2. Create Activity
    const activity = new Activity({
      title: 'Test Activity',
      description: 'Test Description',
      date: new Date(),
      duration: 2,
      location: 'Test Location',
      organizer: org._id
    });
    await activity.save();
    console.log('✓ Activity created:', activity._id);

    // 3. Create Volunteer
    const volunteer = new User({
      name: 'Test Volunteer',
      email: `vol_${Date.now()}@test.com`,
      password: 'password123',
      role: 'volunteer'
    });
    await volunteer.save();
    console.log('✓ Volunteer created:', volunteer._id);

    // 4. Volunteer Joins
    const participation = new Participation({
      activity: activity._id,
      volunteer: volunteer._id,
      status: 'pending'
    });
    await participation.save();
    console.log('✓ Participation created:', participation._id);

    // 5. Query Participations
    const results = await Participation.find({ activity: activity._id }).populate('volunteer');
    console.log('Query results length:', results.length);
    if (results.length > 0) {
      console.log('First result volunteer:', results[0].volunteer ? results[0].volunteer.name : 'NULL');
    }

    if (results.length === 1 && results[0].volunteer) {
      console.log('SUCCESS: Backend logic is correct.');
    } else {
      console.log('FAILURE: Could not retrieve participation correctly.');
    }

    // Cleanup
    await User.deleteMany({ _id: { $in: [org._id, volunteer._id] } });
    await Activity.deleteOne({ _id: activity._id });
    await Participation.deleteOne({ _id: participation._id });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

run();
