import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('anapoorna_token');
    const storedUser = localStorage.getItem('anapoorna_user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      // Optionally fetch fresh user profile from backend
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      localStorage.setItem('anapoorna_user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Failed to fetch user context', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, ...userData } = res.data;
    localStorage.setItem('anapoorna_token', token);
    localStorage.setItem('anapoorna_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (registerData) => {
    const res = await api.post('/auth/register', registerData);
    const { token, ...userData } = res.data;
    localStorage.setItem('anapoorna_token', token);
    localStorage.setItem('anapoorna_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('anapoorna_token');
    localStorage.removeItem('anapoorna_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
