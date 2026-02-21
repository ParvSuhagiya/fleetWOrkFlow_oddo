import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Login/Register Page Component
 * Combined login and registration forms with toggle
 * Redirects based on user role after successful login
 */
const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState('dispatcher');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      // Call login function from AuthContext
      const data = await login(loginEmail, loginPassword);

      // Redirect based on role
      const roleRoutes = {
        manager: '/dashboard',
        dispatcher: '/dispatch',
        safety: '/drivers',
        finance: '/reports',
      };

      const redirectPath = roleRoutes[data.user.role] || '/dashboard';
      navigate(redirectPath);
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');
    setRegisterLoading(true);

    try {
      // Validate form
      if (!registerName || !registerEmail || !registerPassword) {
        throw new Error('Please fill in all fields');
      }

      // Call register endpoint
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
          role: registerRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Clear form and show success message
      setRegisterSuccess(`✅ Registration successful! You can now login with ${registerEmail}`);
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterRole('dispatcher');

      // Auto-switch to login after 2 seconds
      setTimeout(() => {
        setIsLogin(true);
      }, 2000);
    } catch (err) {
      setRegisterError(err.message || 'Registration failed. Please try again.');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">FleetFlow</h1>
            <p className="text-gray-600">Fleet Management System</p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => {
                setIsLogin(true);
                setLoginError('');
                setRegisterError('');
                setRegisterSuccess('');
              }}
              className={`flex-1 py-2 px-4 rounded font-medium transition-all ${
                isLogin
                  ? 'bg-blue-600 text-white'
                  : 'bg-transparent text-gray-700 hover:bg-gray-200'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setLoginError('');
                setRegisterError('');
                setRegisterSuccess('');
              }}
              className={`flex-1 py-2 px-4 rounded font-medium transition-all ${
                !isLogin
                  ? 'bg-blue-600 text-white'
                  : 'bg-transparent text-gray-700 hover:bg-gray-200'
              }`}
            >
              Register
            </button>
          </div>

          {/* LOGIN FORM */}
          {isLogin && (
            <>
              {/* Error Message */}
              {loginError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {loginError}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label htmlFor="login-email" className="block text-gray-700 font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="login-email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="login-password" className="block text-gray-700 font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="login-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-colors ${
                    loginLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loginLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
                <p className="font-semibold text-gray-700 mb-2">Demo Credentials:</p>
                <div className="space-y-1 text-gray-600 text-xs">
                  <p><strong>Manager:</strong> manager@fleetflow.com / password123</p>
                  <p><strong>Dispatcher:</strong> dispatcher@fleetflow.com / password123</p>
                  <p><strong>Safety:</strong> safety@fleetflow.com / password123</p>
                  <p><strong>Finance:</strong> finance@fleetflow.com / password123</p>
                </div>
              </div>
            </>
          )}

          {/* REGISTER FORM */}
          {!isLogin && (
            <>
              {/* Error Message */}
              {registerError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {registerError}
                </div>
              )}

              {/* Success Message */}
              {registerSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                  {registerSuccess}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Name Input */}
                <div>
                  <label htmlFor="register-name" className="block text-gray-700 font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="register-name"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="register-email" className="block text-gray-700 font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="register-email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="register-password" className="block text-gray-700 font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="register-password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Enter password (min 6 characters)"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Role Select */}
                <div>
                  <label htmlFor="register-role" className="block text-gray-700 font-medium mb-2">
                    Role
                  </label>
                  <select
                    id="register-role"
                    value={registerRole}
                    onChange={(e) => setRegisterRole(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="dispatcher">Dispatcher</option>
                    <option value="manager">Manager</option>
                    <option value="safety">Safety Officer</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={registerLoading}
                  className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-colors ${
                    registerLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {registerLoading ? 'Creating Account...' : 'Register'}
                </button>
              </form>

              {/* Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
                <p className="text-gray-700">
                  <strong>Roles:</strong>
                </p>
                <ul className="mt-2 space-y-1 text-gray-600 text-xs">
                  <li>• <strong>Manager:</strong> Full fleet management access</li>
                  <li>• <strong>Dispatcher:</strong> Trip management & routing</li>
                  <li>• <strong>Safety Officer:</strong> Driver safety monitoring</li>
                  <li>• <strong>Finance:</strong> Financial reports & analytics</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
