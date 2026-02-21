import React, { createContext, useState, useContext } from 'react';

/**
 * AuthContext
 * Manages authentication state across the application
 * Provides: login, logout, user data, and loading state
 */
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  /**
   * Login function
   * Sends credentials to backend and stores token if successful
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout function
   * Clears token and user data
   */
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  /**
   * Restore user session from token if available
   */
  const restoreSession = React.useCallback(async () => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      try {
        const response = await fetch('http://localhost:5000/api/me', {
          headers: {
            'Authorization': `Bearer ${savedToken}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Session restore error:', error);
        logout();
      }
    }
  }, []);

  // Restore session on mount
  React.useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use AuthContext
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
