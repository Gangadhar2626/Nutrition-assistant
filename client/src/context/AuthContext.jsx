import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, userAPI } from '../services/api';
import { getRoleDashboardPath } from '../utils/validators';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await userAPI.getProfile();
        setUser(data);
        setToken(storedToken);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [logout]);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setToken(data.token);
    setUser(data);
    return getRoleDashboardPath(data.role);
  };

  const register = async (formData) => {
    const { data } = await authAPI.register(formData);
    if (data.role === 'dietitian' && !data.isApproved) {
      return { pending: true };
    }
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setToken(data.token);
    setUser(data);
    return { path: getRoleDashboardPath(data.role) };
  };

  const updateProfile = async (formData) => {
    const { data } = await userAPI.updateProfile(formData);
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
