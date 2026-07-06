import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log('Admin user already exists. Skipping seed.');
      process.exit(0);
    }

    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error('Please set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD in .env');
      process.exit(1);
    }

    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
      isApproved: true,
    });

    console.log('Admin user created successfully!');
    console.log(`Email: ${ADMIN_EMAIL}`);
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
