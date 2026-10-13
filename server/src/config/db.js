import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/freelancermate_ai');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Optional: exit process or allow app to start with warning
    console.warn('⚠️ Server will continue running, but database operations will fail until MongoDB is accessible.');
  }
};
