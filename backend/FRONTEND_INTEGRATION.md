# Frontend Integration Guide

This guide explains how to connect your React frontend to this backend.

---

## 🔗 API Base URL

All API calls should use this base URL:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## 📝 Example: Axios Configuration (frontend/src/config/axios.js)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

export default api;
```

---

## 💻 Example: Integration with React Components

### RegisterPage.jsx

```javascript
import axios from 'axios';
import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        { email }
      );

      if (response.data.success) {
        setMessage('✅ OTP sent! Check your email.');
        // Redirect to OTP verification page
      }
    } catch (error) {
      setMessage('❌ ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

### LoginPage.jsx

```javascript
import axios from 'axios';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email }
      );

      if (response.data.success) {
        setMessage('✅ OTP sent! Check your email.');
        // Redirect to OTP verification page
      }
    } catch (error) {
      setMessage('❌ ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending OTP...' : 'Login'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

### OtpVerificationPage.jsx

```javascript
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OtpVerificationPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/verify-otp',
        { email, otp }
      );

      if (response.data.success) {
        setMessage('✅ ' + response.data.message);
        
        // Store user info (optional)
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect to dashboard
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (error) {
      setMessage('❌ ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
        required
      />
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter 6-digit OTP"
        maxLength="6"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

---

## 🔌 Using Axios Instance (Recommended)

Create a centralized axios config in `frontend/src/config/axios.js`:

```javascript
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.message);
    return Promise.reject(error);
  }
);

export default api;
```

Then use in components:

```javascript
import { api } from '../config/axios';

// In component
const response = await api.post('/auth/register', { email });
```

---

## 🌐 Environment Variables (frontend/.env)

```
VITE_API_URL=http://localhost:5000/api
```

---

## ⚠️ CORS Configuration

The backend is configured for CORS with:

```javascript
cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
})
```

If frontend runs on different port, update backend `.env`:

```env
FRONTEND_URL=http://localhost:YOUR_PORT
```

---

## 🧪 Testing the API

Use **Postman** or **Thunder Client** to test:

1. **Register a user**
   - POST: `http://localhost:5000/api/auth/register`
   - Body: `{ "email": "test@gmail.com" }`

2. **Check your email for OTP**
   - Copy the 6-digit OTP

3. **Verify OTP**
   - POST: `http://localhost:5000/api/auth/verify-otp`
   - Body: `{ "email": "test@gmail.com", "otp": "123456" }`

---

## 📊 Data Flow Diagram

```
Frontend                                Backend
   │                                      │
   ├─── POST /register ──────────────────>│
   │    (email)                           │
   │                                 Create User
   │                                 Generate OTP
   │                                 Send Email
   │<─── OTP sent response ──────────────┤
   │                                      │
   ├─(User gets OTP from email)───────┐  │
   │                                   │  │
   ├─── POST /verify-otp ────────────>│  │
   │    (email, otp)                  │  │
   │                                 Verify OTP
   │<─── Auth successful ─────────────┤  │
   │    (user data)                      │
   │                                      │
   └─(Store token/user, Redirect)       │
```

---

## 💡 Best Practices

1. **Error Handling**
   ```javascript
   try {
     const response = await api.post('/auth/register', { email });
   } catch (error) {
     const errorMsg = error.response?.data?.message || 'Something went wrong';
     console.error(errorMsg);
   }
   ```

2. **Loading States**
   ```javascript
   const [isLoading, setIsLoading] = useState(false);
   
   const handleSubmit = async () => {
     setIsLoading(true);
     try {
       // API call
     } finally {
       setIsLoading(false);
     }
   };
   ```

3. **User Session**
   ```javascript
   // Store after successful verification
   localStorage.setItem('user', JSON.stringify(user));
   
   // Retrieve on app load
   const user = JSON.parse(localStorage.getItem('user'));
   ```

---

**Happy integrating! 🚀**
