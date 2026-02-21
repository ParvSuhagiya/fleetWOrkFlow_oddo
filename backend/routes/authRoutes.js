/**
 * Routes: Authentication Endpoints
 * 
 * This file defines all authentication-related API endpoints:
 * - POST /api/auth/register - Create new user
 * - POST /api/auth/login - Login existing user
 * - POST /api/auth/verify-otp - Verify OTP and authenticate
 * 
 * Called from: server.js
 */

import express from 'express';
import {
  register,
  login,
  verifyOtp,
} from '../controllers/authController.js';

const router = express.Router();

/**
 * 1️⃣ REGISTER ENDPOINT
 * POST /api/auth/register
 * 
 * Body: { email: "user@gmail.com" }
 * Response: { success: true, message: "OTP sent to your email" }
 */
router.post('/register', register);

/**
 * 2️⃣ LOGIN ENDPOINT
 * POST /api/auth/login
 * 
 * Body: { email: "user@gmail.com" }
 * Response: { success: true, message: "OTP sent to your email" }
 */
router.post('/login', login);

/**
 * 3️⃣ VERIFY OTP ENDPOINT
 * POST /api/auth/verify-otp
 * 
 * Body: { email: "user@gmail.com", otp: "123456" }
 * Response: { success: true, message: "Authentication successful", user: {...} }
 */
router.post('/verify-otp', verifyOtp);

export default router;
