/**
 * Controller: Authentication Logic
 * 
 * This file contains all authentication-related business logic:
 * - Register: Create new user with password and send OTP
 * - Login: Verify password and send OTP
 * - Verify OTP: Validate OTP and mark user as verified
 * 
 * Called from: routes/authRoutes.js
 */

import User from '../models/User.js';
import generateOtp from '../utils/generateOtp.js';
import { sendOtpEmail } from '../config/mailer.js';
import bcrypt from 'bcrypt';

/**
 * 1️⃣ REGISTER - Create new user account
 * 
 * POST /api/auth/register
 * 
 * Request Body: { email: "user@gmail.com", password: "securePass123" }
 * 
 * Process:
 * 1. Check if email already exists
 * 2. If exists: return error
 * 3. If not: hash the password using bcrypt
 * 4. Create new user with email + hashed password (isVerified = false)
 * 5. Generate 6-digit OTP
 * 6. Set OTP expiry to 5 minutes
 * 7. Save user to database
 * 8. Send OTP via email
 * 9. Return success message
 */
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered. Please login instead.',
      });
    }

    // ✅ Hash password using bcrypt (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Generate OTP (6 digits)
    const otp = generateOtp();

    // ✅ Calculate OTP expiry (5 minutes from now)
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    // ✅ Create new user with hashed password
    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      otp: otp,
      otpExpires: otpExpires,
      isVerified: false,
    });

    // ✅ Save user to database
    await newUser.save();

    // ✅ Send OTP via email
    const emailSent = await sendOtpEmail(email, otp);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again.',
      });
    }

    // ✅ Return success
    res.status(201).json({
      success: true,
      message: 'Registration successful! OTP sent to your email.',
    });
  } catch (error) {
    console.error('Register Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again later.',
    });
  }
};

/**
 * 2️⃣ LOGIN - Send OTP to existing user
 * 
 * POST /api/auth/login
 * 
 * Request Body: { email: "user@gmail.com", password: "securePass123" }
 * 
 * Process:
 * 1. Check if user exists
 * 2. If not: return error
 * 3. Verify password using bcrypt
 * 4. If password wrong: return error
 * 5. If correct: generate new OTP
 * 6. Set OTP expiry to 5 minutes
 * 7. Update user with new OTP
 * 8. Send OTP via email
 * 9. Return success message
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // ✅ Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.',
      });
    }

    // ✅ Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please try again.',
      });
    }

    // ✅ Generate new OTP
    const otp = generateOtp();

    // ✅ Calculate OTP expiry (5 minutes from now)
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    // ✅ Update user with new OTP
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // ✅ Send OTP via email
    const emailSent = await sendOtpEmail(email, otp);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again.',
      });
    }

    // ✅ Return success
    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete login.',
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again later.',
    });
  }
};

/**
 * 3️⃣ VERIFY OTP - Authenticate user
 * 
 * POST /api/auth/verify-otp
 * 
 * Request Body: { email: "user@gmail.com", otp: "123456" }
 * 
 * Process:
 * 1. Validate email and OTP input
 * 2. Check if user exists
 * 3. Check if OTP matches
 * 4. Check if OTP not expired
 * 5. If all valid: set isVerified = true
 * 6. Clear OTP and OTP expiry from database
 * 7. Save user
 * 8. Return success message
 */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // ✅ Validate inputs
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    // ✅ Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // ✅ Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.',
      });
    }

    // ✅ Check if OTP is expired
    if (!user.otpExpires || new Date() > user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired. Please request a new OTP.',
      });
    }

    // ✅ OTP is valid - Mark user as verified
    user.isVerified = true;
    user.otp = null; // Clear OTP
    user.otpExpires = null; // Clear expiry
    await user.save();

    // ✅ Return success
    res.status(200).json({
      success: true,
      message: 'Authentication successful! You are now logged in.',
      user: {
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Verify OTP Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'OTP verification failed. Please try again later.',
    });
  }
};
