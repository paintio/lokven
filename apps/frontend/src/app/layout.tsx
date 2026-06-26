'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NotificationBell from '@/components/NotificationBell';
import ClientOnly from '@/components/ClientOnly';
import Footer from '@/components/Footer';
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Удаляем старый Service Worker если есть
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister();
        }
      });
    }
    
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);
        setIsAdmin(parsedUser.role === 'admin');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#111827" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Локвен" />
      </head>
      <body suppressHydrationWarning>
        <header className="header-glass sticky top-0 z-50">
          <div className="container-custom">
            <div className="flex items-center justify-between h-14 gap-4">
              <div className="flex items-center gap-6 flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <img 
                    src="/logo-lokven.png" 
                    alt="Локвен" 
                    className="h-24 w-auto" 
                  />
                </Link>
                <nav className="hidden md:flex items-center gap-5 text-sm">
                  <Link href="/" className="text-secondary hover:text-primary transition-colors font-medium">
                    Главная
                  </Link>
                  <Link href="/listings" className="text-secondary hover:text-primary transition-colors font-medium">
                    Объявления
                  </Link>
                  <Link href="/listings/create" className="text-secondary hover:text-primary transition-colors font-medium">
                    Подать
                  </Link>
                </nav>
              </div>

              <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по объявлениям..."
                    className="w-full px-4 py-1.5 text-sm rounded-full border border-[#E5E7EB] bg-white/80 backdrop-blur-sm focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#3B82F6] transition-colors"
                  >
                    🔍
                  </button>
                </div>
              </form>

              <ClientOnly>
                <div className="flex items-center gap-3 text-sm flex-shrink-0">
                  {mounted && isAuthenticated ? (
                    <>
                      <NotificationBell />
                      <Link href="/profile" className="text-secondary hover:text-primary transition-colors font-medium">
                        {user?.name || 'Профиль'}
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" className="text-secondary hover:text-primary transition-colors font-medium bg-[#F3F4F6] px-3 py-1 rounded-lg">
                          Админка
                        </Link>
                      )}
                      <button 
                        onClick={() => {
                          localStorage.removeItem('token');
                          localStorage.removeItem('user');
                          window.location.href = '/';
                        }}
                        className="text-secondary hover:text-primary transition-colors font-medium"
                      >
                        Выйти
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/login" className="text-secondary hover:text-primary transition-colors font-medium">
                        Войти
                      </Link>
                      <Link href="/auth/register" className="btn-primary">
                        Регистрация
                      </Link>
                    </>
                  )}
                </div>
              </ClientOnly>
            </div>
          </div>
        </header>
        <main className="min-h-screen py-5">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
import ClearSW from '@/components/ClearSW';

// Добавить внутри body до header
<ClearSW />
