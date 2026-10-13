import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/freelancermate_ai';

async function testDatabaseAndUser() {
  console.log('Testing connection to:', mongoUri);
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected successfully!');

    // Cleanup previous test entry if any
    await User.deleteMany({ email: 'john.doe@example.com' });

    // Test creating a user
    const user = await User.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: 28,
      password: 'password123'
    });

    console.log('Created User successfully:');
    console.log({
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      createdAt: user.createdAt
    });

    // Verify password is encrypted and can be matched
    const isPasswordCorrect = await user.matchPassword('password123');
    console.log('Password hashing & comparison verified:', isPasswordCorrect);

    // Verify retrieval
    const fetched = await User.findOne({ email: 'john.doe@example.com' });
    console.log('User found in MongoDB:', fetched ? 'YES' : 'NO');

    // Clean up
    await User.deleteOne({ _id: user._id });
    console.log('Cleaned up test record.');

    await mongoose.disconnect();
    console.log('All tests passed with zero errors!');
    process.exit(0);
  } catch (error) {
    console.error('Test failed with error:', error);
    process.exit(1);
  }
}

testDatabaseAndUser();
