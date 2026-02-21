# 🚀 Fleet Flow Authentication Backend

Complete Node.js + Express + MongoDB backend with Email OTP verification.

---

## 📋 Features

✅ **Email Registration** - Create user account  
✅ **Email Login** - Send OTP to existing user  
✅ **OTP Verification** - Verify email with 6-digit OTP  
✅ **Gmail Integration** - Send OTP using nodemailer  
✅ **MongoDB** - Persistent user storage  
✅ **Error Handling** - Centralized middleware  
✅ **CORS Enabled** - Works with React frontend  

---

## 🏗️ Project Structure

```
backend/
├── server.js                    # Main Express app
├── package.json                 # Dependencies
├── .env                         # Configuration (credentials)
├── config/
│   ├── db.js                   # MongoDB connection
│   └── mailer.js               # Email configuration
├── models/
│   └── User.js                 # MongoDB User schema
├── controllers/
│   └── authController.js       # Business logic
├── routes/
│   └── authRoutes.js           # API endpoints
├── utils/
│   └── generateOtp.js          # OTP generation
└── middleware/
    └── errorMiddleware.js      # Error handling
```

---

## 🔧 Setup Instructions

### 1️⃣ Install Dependencies

```bash
cd backend
npm install
```

This installs:
- **express** - Web framework
- **mongoose** - MongoDB ORM
- **nodemailer** - Email sender
- **dotenv** - Environment variables
- **cors** - Cross-origin requests

### 2️⃣ MongoDB Setup

You need a MongoDB connection string. Choose one:

**Option A: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/fleet_flow`

**Option B: Local MongoDB**
- No setup needed if MongoDB is running
- Connection string: `mongodb://localhost:27017/fleet_flow`

### 3️⃣ Gmail Configuration

To send OTP emails via Gmail:

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select: "Mail" and "Windows Computer"
   - Google will generate a 16-character password
   - Example: `abcd efgh ijkl mnop`

3. **Copy to .env**
   - Use this 16-character password (no spaces)
   - Example: `abcdefghijklmnop`

### 4️⃣ Configure .env File

Create `.env` file in backend folder:

```env
# MongoDB Connection String
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fleet_flow

# Gmail SMTP Configuration
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=abcdefghijklmnop

# Server Port
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 5️⃣ Start Server

```bash
npm run dev
```

Expected output:
```
╔════════════════════════════════════╗
║  🚀 Fleet Flow Server Running       ║
║  Port: 5000                         ║
║  Status: ✅ Ready for Requests     ║
╚════════════════════════════════════╝
```

Test it: http://localhost:5000/api/health

---

## 📡 API Endpoints

### 1️⃣ Register New User

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "email": "user@gmail.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Registration successful! OTP sent to your email."
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Email already registered. Please login instead."
}
```

---

### 2️⃣ Login Existing User

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "user@gmail.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "OTP sent to your email. Please verify to login."
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "User not found. Please register first."
}
```

---

### 3️⃣ Verify OTP

**Endpoint:** `POST /api/auth/verify-otp`

**Request:**
```json
{
  "email": "user@gmail.com",
  "otp": "123456"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Authentication successful! You are now logged in.",
  "user": {
    "email": "user@gmail.com",
    "isVerified": true
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid OTP. Please try again."
}
```

---

## 🧪 Testing with Postman / Thunder Client

### Test Register:
1. Method: `POST`
2. URL: `http://localhost:5000/api/auth/register`
3. Body (JSON):
   ```json
   {
     "email": "test@gmail.com"
   }
   ```
4. Send and check your email for OTP

### Test Verify OTP:
1. Method: `POST`
2. URL: `http://localhost:5000/api/auth/verify-otp`
3. Body (JSON):
   ```json
   {
     "email": "test@gmail.com",
     "otp": "123456"
   }
   ```
4. Replace "123456" with actual OTP from email

---

## 📊 Database Schema (MongoDB)

**Collection:** `users`

```javascript
{
  _id: ObjectId,
  email: "user@gmail.com",           // Unique, lowercase
  otp: "123456",                     // 6-digit code
  otpExpires: 2026-02-21T10:30:00Z,  // Expires in 5 minutes
  isVerified: false,                 // true after OTP verification
  createdAt: 2026-02-21T10:25:00Z    // Auto-set on registration
}
```

---

## 🔐 Security Notes

⚠️ **Important:**

1. **Never commit .env file** - Add to `.gitignore`
2. **Use App Passwords** - Not regular Gmail passwords
3. **OTP expires in 5 minutes** - Can't be reused after expiry
4. **Email validation** - Frontend should validate email format
5. **Rate limiting** - Consider adding rate limiter for production

---

## 🐛 Common Issues

### ❌ "Failed to send OTP"
- Check EMAIL_USER and EMAIL_PASS in .env
- Verify Gmail App Password is 16 characters
- Enable 2-Factor Authentication on Gmail
- Check Gmail security settings

### ❌ "MongoDB Connection Error"
- Verify MONGO_URI in .env
- Check MongoDB is running (local) or online (Atlas)
- Verify network access (Atlas Dashboard)

### ❌ "CORS Error"
- Check FRONTEND_URL in .env
- Should match your React app URL
- Default: `http://localhost:5173`

---

## 📝 File Explanations

| File | Purpose |
|------|---------|
| `server.js` | Main Express application entry point |
| `config/db.js` | MongoDB connection setup |
| `config/mailer.js` | Email configuration with nodemailer |
| `models/User.js` | MongoDB User schema definition |
| `controllers/authController.js` | Register, Login, VerifyOTP logic |
| `routes/authRoutes.js` | API endpoint definitions |
| `utils/generateOtp.js` | Random 6-digit OTP generator |
| `middleware/errorMiddleware.js` | Centralized error handling |

---

## 🚀 Production Deployment

For production deployment on services like Heroku, Railway, Render:

1. Set environment variables on hosting platform
2. Use MongoDB Atlas (not local)
3. Add rate limiting middleware
4. Enable HTTPS
5. Add request validation
6. Implement JWT tokens (optional, for sessions)

---

## 📞 Support

For issues:
1. Check error messages in console
2. Verify .env configuration
3. Check MongoDB connection
4. Verify Gmail credentials

---

**Happy coding! 🚀**
