import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    
    console.log('=== CHECK AUTH ===');
    console.log('Token exists:', !!token);
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('User role:', parsedUser.role);
        
        if (parsedUser.role === 'admin') {
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log('User authenticated:', parsedUser.email);
        } else {
          console.log('User is not admin');
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error parsing user:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    } else {
      console.log('No token or user found');
    }
    
    setLoading(false);
    console.log('=== CHECK AUTH COMPLETE ===');
  };

  const login = async (credentials) => {
    console.log('=== LOGIN ATTEMPT ===');
    
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    
    try {
      const response = await axios.post('/auth/login', formData);
      console.log('Login response status:', response.status);
      
      if (!response.data.access_token) {
        throw new Error('No access token received');
      }
      
      // Store token and user
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Verify user is admin
      if (response.data.user.role !== 'admin') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        throw new Error('Admin access required');
      }
      
      setUser(response.data.user);
      setIsAuthenticated(true);
      console.log('Login successful');
      
      return response.data;
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('=== LOGOUT ===');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};