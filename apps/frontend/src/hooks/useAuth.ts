'use client';

import { useEffect, useState } from 'react';

function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()!.split(';').shift()!);
  }
  return null;
}

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // 👈 ДОБАВЛЯЕМ

  const checkAuth = () => {
    try {
      const token = getCookie('token') || localStorage.getItem('token');
      const userData = getCookie('user') || localStorage.getItem('user');
      
      if (token && userData) {
        const parsed = typeof userData === 'string' ? JSON.parse(userData) : userData;
        setUser(parsed);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [refreshTrigger]); // 👈 ЗАВИСИМ ОТ ТРИГГЕРА

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; max-age=0';
    document.cookie = 'user=; path=/; max-age=0';
    setUser(null);
    setRefreshTrigger(prev => prev + 1); // 👈 ТРИГГЕРИМ ОБНОВЛЕНИЕ
  };

  const refreshUser = () => {
    setRefreshTrigger(prev => prev + 1); // 👈 ТРИГГЕРИМ ОБНОВЛЕНИЕ
  };

  return { 
    user, 
    loading, 
    isAuthenticated: !!user,
    logout,
    refreshUser,
  };
}