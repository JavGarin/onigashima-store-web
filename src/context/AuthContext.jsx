// SUPABASE DISABLED - Using mock data for demo purposes
// import { supabase } from '../supabaseClient';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock session check
    const getSession = async () => {
      // Simulate checking session
      setTimeout(() => {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      }, 500);
    };

    getSession();
  }, []);

  const login = async (email, password) => {
    // Mock login
    console.log("Mock login attempt", email);
    return { user: { email }, session: {} };
  };

  const signUp = async (email, password) => {
    // Mock signup
    console.log("Mock signup attempt", email);
    return { user: { email }, session: {} };
  };

  const logout = async () => {
    // Mock logout
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signUp,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
