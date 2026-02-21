/**
 * Config: MongoDB Connection
 * 
 * This file handles the connection to MongoDB using Mongoose.
 * It reads the MONGO_URI from the .env file.
 * 
 * Called from: server.js
 */

import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from .env
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1); // Exit the application if DB connection fails
  }
};

export default connectDB;
