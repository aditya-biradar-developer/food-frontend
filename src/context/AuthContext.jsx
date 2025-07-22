import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentRole, setCurrentRole] = useState(localStorage.getItem('currentRole') || 'user'); // Add currentRole state with persistence

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Sync currentRole with user role when user changes
  useEffect(() => {
    if (user) {
      setCurrentRole(user.role);
      localStorage.setItem('currentRole', user.role);
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
      setCurrentRole(response.data.user.role); // Set current role
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setToken(token);
      setUser(user);
      setCurrentRole(user.role); // Set current role after login
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setToken(token);
      setUser(user);
      setCurrentRole(user.role); // Set current role after register
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    setCurrentRole('user'); // Reset to default role
  };

  const switchUserRole = async (newRole) => {
    try {
      const response = await api.post('/users/switch-role', { role: newRole });
      setUser(response.data.user);
      setCurrentRole(newRole); // Update current role immediately
      return { success: true };
    } catch (error) {
      if (error.response?.data?.requiresSetup) {
        return { 
          success: false, 
          requiresSetup: true,
          message: error.response.data.message 
        };
      }
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to switch role' 
      };
    }
  };

  const toggleRole = () => {
    const newRole = currentRole === 'user' ? 'owner' : 'user';
    setCurrentRole(newRole);
    localStorage.setItem('currentRole', newRole);
    return newRole;
  };

  const setupRestaurant = async (restaurantName) => {
    try {
      const response = await api.post('/users/setup-restaurant', { restaurantName });
      setUser(response.data.user);
      setCurrentRole('owner'); // Set role to owner after setup
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to setup restaurant' 
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    currentRole,
    login,
    register,
    logout,
    switchUserRole,
    setupRestaurant,
    toggleRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};