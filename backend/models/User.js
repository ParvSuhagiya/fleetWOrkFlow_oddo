/**
 * Model: User Schema
 * 
 * This defines the MongoDB schema for users using Mongoose.
 * 
 * Fields:
 * - email: User's email address (unique, required)
 * - password: Hashed password (stored securely with bcrypt)
 * - otp: 6-digit one-time password for verification
 * - otpExpires: Timestamp when OTP expires (5 minutes from generation)
 * - isVerified: Whether user has successfully verified their email
 * - createdAt: Account creation timestamp
 * 
 * Called from: authController.js
 */

import mongoose from 'mongoose';

// Define User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Store email in lowercase for consistency
    trim: true, // Remove whitespace
  },
  password: {
    type: String,
    required: true, // Password is now required
  },
  otp: {
    type: String,
    default: null, // Null when not needed
  },
  otpExpires: {
    type: Date,
    default: null, // Null when not needed
  },
  isVerified: {
    type: Boolean,
    default: false, // User not verified on registration
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set current timestamp on creation
  },
});

// Create User model from schema
const User = mongoose.model('User', userSchema);

export default User;
