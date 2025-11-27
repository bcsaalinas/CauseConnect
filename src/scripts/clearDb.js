import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

import User from '../models/User.js';
import Activity from '../models/Activity.js';
import Participation from '../models/Participation.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/causeconnect';

const clearDb = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    console.log('Clearing database...');
    
    await User.deleteMany({});
    console.log('✓ Users cleared');

    await Activity.deleteMany({});
    console.log('✓ Activities cleared');

    await Participation.deleteMany({});
    console.log('✓ Participations cleared');

    console.log('Database cleared successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

clearDb();
