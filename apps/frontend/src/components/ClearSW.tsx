'use client';

import { useEffect } from 'react';

export default function ClearSW() {
  useEffect(() => {
    // Удаляем все Service Workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister();
          console.log('SW unregistered:', registration);
        }
      });
    }
    
    // Очищаем кэш
    if ('caches' in window) {
      caches.keys().then(function(names) {
        for (let name of names) {
          caches.delete(name);
          console.log('Cache deleted:', name);
        }
      });
    }
  }, []);

  return null;
}
