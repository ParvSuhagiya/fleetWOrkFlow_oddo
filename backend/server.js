/**
 * SERVER: Fleet Flow Authentication Backend
 * 
 * This is the main entry point of the Express application.
 * 
 * What it does:
 * 1. Loads environment variables from .env file
 * 2. Connects to MongoDB database
 * 3. Sets up middleware (CORS, JSON parser)
 * 4. Registers all API routes
 * 5. Starts the server on PORT 5000
 * 
 * Run: node server.js
 * 
 * ========================
 * SETUP INSTRUCTIONS:
 * ========================
 * 1. Create .env file with:
 *    - MONGO_URI (MongoDB connection string)
 *    - EMAIL_USER (Gmail address)
 *    - EMAIL_PASS (Gmail App Password - 16 characters)
 *    - PORT (default 5000)
 * 
 * 2. Install dependencies:
 *    npm install
 * 
 * 3. Run server:
 *    npm run dev
 * 
 * ========================
 * API ENDPOINTS:
 * ========================
 * 
 * 1. Register New User
 *    POST http://localhost:5000/api/auth/register
 *    Body: { "email": "user@gmail.com" }
 * 
 * 2. Login Existing User
 *    POST http://localhost:5000/api/auth/login
 *    Body: { "email": "user@gmail.com" }
 * 
 * 3. Verify OTP
 *    POST http://localhost:5000/api/auth/verify-otp
 *    Body: { "email": "user@gmail.com", "otp": "123456" }
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';

// ✅ Load environment variables from .env file
dotenv.config();

// ✅ Create Express application
const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware: Parse JSON request bodies
app.use(express.json());

// ✅ Middleware: Enable CORS (Cross-Origin Requests)
// This allows the React frontend to communicate with this backend
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
}));

// ✅ Health Check Endpoint
// Test if server is running: GET http://localhost:5000/api/health
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running ✅',
  });
});

// ✅ Authentication Routes
// Base URL: http://localhost:5000/api/auth
app.use('/api/auth', authRoutes);

// ✅ Catch 404 (Route Not Found)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ✅ Error Handling Middleware (Must be last)
app.use(errorMiddleware);

// ✅ Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════╗
║  🚀 Fleet Flow Server Running       ║
║  Port: ${PORT}                        ║
║  Status: ✅ Ready for Requests     ║
╚════════════════════════════════════╝
  `);
});
