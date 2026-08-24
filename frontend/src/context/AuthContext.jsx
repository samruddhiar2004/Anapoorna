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
    }
    setLoading(false);
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      localStorage.setItem('anapoorna_user', JSON.stringify(res.data));
    } catch (err) {
      console.warn('Backend offline - preserving local presentation context');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, ...userData } = res.data;
      localStorage.setItem('anapoorna_token', token);
      localStorage.setItem('anapoorna_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      // Standalone Presentation Demo Fallback (Works even when laptop is CLOSED/OFFLINE)
      if (!err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        console.log('Backend unreachable - entering Standalone Demo Mode');
        const role = email.includes('ngo') ? 'NGO' : (email.includes('admin') ? 'ADMIN' : 'DONOR');
        const demoUser = {
          id: Date.now(),
          name: email.split('@')[0].toUpperCase() + ' (Demo User)',
          email: email,
          role: role,
          phone: '+91 9876543210',
          address: 'Mumbai Central Depot'
        };
        const mockToken = 'demo_jwt_token_' + Date.now();
        localStorage.setItem('anapoorna_token', mockToken);
        localStorage.setItem('anapoorna_user', JSON.stringify(demoUser));
        setUser(demoUser);
        return demoUser;
      }
      throw err;
    }
  };

  const register = async (registerData) => {
    try {
      const res = await api.post('/auth/register', registerData);
      const { token, ...userData } = res.data;
      localStorage.setItem('anapoorna_token', token);
      localStorage.setItem('anapoorna_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      // Standalone Presentation Demo Fallback (Works even when laptop is CLOSED/OFFLINE)
      if (!err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        console.log('Backend unreachable - registering in Standalone Demo Mode');
        const demoUser = {
          id: Date.now(),
          name: registerData.name || 'Demo Organization',
          email: registerData.email || 'demo@anapoorna.org',
          role: registerData.role || 'DONOR',
          phone: registerData.phone || '+91 9876543210',
          address: registerData.address || 'Mumbai, India',
          latitude: registerData.latitude || 19.0760,
          longitude: registerData.longitude || 72.8777
        };
        const mockToken = 'demo_jwt_token_' + Date.now();
        localStorage.setItem('anapoorna_token', mockToken);
        localStorage.setItem('anapoorna_user', JSON.stringify(demoUser));
        setUser(demoUser);
        return demoUser;
      }
      throw err;
    }
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
