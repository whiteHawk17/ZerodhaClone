import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('AuthContext: Token from localStorage', token);

    if (!token) {
      setLoading(false);
      console.log('AuthContext: No token found, setting loading to false.');
      return; // No token, no need to verify
    }

    const checkAuth = async () => {
      try {
        console.log('AuthContext: Attempting to verify token with backend...');
        const response = await axios.get('/auth/verify');
        console.log('AuthContext: Backend verification response', response.data);
        if (response.data?.user) {
          setUser(response.data.user);
          console.log('AuthContext: User successfully set.', response.data.user);
        } else {
          console.log('AuthContext: Backend verification failed (no user data), redirecting.');
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          window.location.replace('http://localhost:3000/login');
        }
      } catch (error) {
        console.error("AuthContext: Auth check failed:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        window.location.replace('http://localhost:3000/login');
      } finally {
        setLoading(false);
        console.log('AuthContext: Loading set to false.');
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setUser(null);
    console.log('AuthContext: User logged out, redirecting to frontend login.');
    window.location.replace('http://localhost:3000/login');
  };

  const value = {
    user,
    loading,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 