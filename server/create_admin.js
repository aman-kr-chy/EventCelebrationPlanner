import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const run = async () => {
  try {
    console.log("Connecting to MongoDB:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const adminEmail = 'admin@example.com';
    
    // Check if user exists
    let adminUser = await User.findOne({ email: adminEmail });
    
    if (adminUser) {
      adminUser.role = 'admin';
      await adminUser.save();
      console.log(`Updated existing user ${adminEmail} to admin role.`);
    } else {
      adminUser = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: 'password123',
        role: 'admin',
        phone: '1234567890'
      });
      console.log(`Created new admin user: ${adminEmail} with password: password123`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
};

run();
