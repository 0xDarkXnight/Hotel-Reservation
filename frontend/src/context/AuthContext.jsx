import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../api/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => api.getStoredUser());
  const [token, setTokenState] = useState(() => api.getToken());
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.isAdmin === true;

  const loginUser = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      const userData = data.email; // backend returns user object under "email" key
      setUser(userData);
      setTokenState(data.token);
      api.setStoredUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerUser = useCallback(async (firstName, lastName, email, password) => {
    setLoading(true);
    try {
      const data = await api.register(firstName, lastName, email, password);
      // Check if data has validation errors (returned as { field: "message" })
      if (data.firstName || data.lastName || data.email || data.password) {
        const err = new Error('Validation failed');
        err.data = data;
        throw err;
      }
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    api.clearToken();
    setUser(null);
    setTokenState(null);
  }, []);

  const updateProfile = useCallback(async (params) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await api.updateUser(user.id, params);
      const updatedUser = { ...user, ...params };
      setUser(updatedUser);
      api.setStoredUser(updatedUser);
      return updatedUser;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refreshUser = useCallback(async () => {
    if (!user?.id) return;
    try {
      const freshUser = await api.getUser(user.id);
      setUser(freshUser);
      api.setStoredUser(freshUser);
    } catch {
      // If user fetch fails, clear auth
      logout();
    }
  }, [user?.id, logout]);

  const value = {
    user,
    token,
    isAuthenticated,
    isAdmin,
    loading,
    login: loginUser,
    register: registerUser,
    logout,
    updateProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
