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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
  }, [refreshTrigger]);

  // 👈 СЛУШАЕМ ИЗМЕНЕНИЯ В ТОЙ ЖЕ ВКЛАДКЕ
  useEffect(() => {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      originalSetItem.apply(this, [key, value]);
      if (key === 'token' || key === 'user') {
        setRefreshTrigger(prev => prev + 1);
      }
    };

    const cookieInterval = setInterval(() => {
      const token = getCookie('token');
      const userData = getCookie('user');
      if (token || userData) {
        setRefreshTrigger(prev => prev + 1);
      }
    }, 300);

    return () => {
      localStorage.setItem = originalSetItem;
      clearInterval(cookieInterval);
    };
  }, []);

  // 👈 ФУНКЦИЯ ВЫХОДА — ПОЛНОСТЬЮ ОЧИЩАЕТ ВСЁ
  const logout = () => {
    // Очищаем localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Очищаем cookies (несколько способов для надёжности)
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'token=; path=/; max-age=0';
    document.cookie = 'user=; path=/; max-age=0';
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Обнуляем состояние
    setUser(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const refreshUser = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return { 
    user, 
    loading, 
    isAuthenticated: !!user,
    logout,
    refreshUser,
  };
}