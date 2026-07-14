'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NotificationBell from '@/components/NotificationBell';
import ClientOnly from '@/components/ClientOnly';
import Footer from '@/components/Footer';
import './globals.css';

function getCookie(name: string) {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()!.split(';').shift()!);
  }

  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const r of regs) r.unregister();
      });
    }

    const syncAuthState = () => {
      const token = getCookie('token');
      const userData = getCookie('user');

      if (!token || !userData) {
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);

        setIsAuthenticated(true);
        setUser(parsedUser);
        setIsAdmin(parsedUser.role === 'admin');
      } catch (e) {
        console.error('Failed to parse user cookie', e);
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
      }
    };

    syncAuthState();
    window.addEventListener('storage', syncAuthState);
    window.addEventListener('authchange', syncAuthState);

    return () => {
      window.removeEventListener('storage', syncAuthState);
      window.removeEventListener('authchange', syncAuthState);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      router.push(
        `/listings?search=${encodeURIComponent(searchQuery.trim())}`
      );
      setSearchQuery('');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    document.cookie =
      'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    document.cookie =
      'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
    window.location.href = '/';
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
                  <Link href="/" className="text-secondary hover:text-primary">
                    Главная
                  </Link>
                  <Link
                    href="/listings"
                    className="text-secondary hover:text-primary"
                  >
                    Объявления
                  </Link>
                  <Link
                    href="/listings/create"
                    className="text-secondary hover:text-primary"
                  >
                    Подать
                  </Link>
                </nav>
              </div>

              {/* =========================
                  🔹 ПОЛЕ ПОИСКА (ОБНОВЛЕНО)
                  ========================= */}
              <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск..."
                  className="w-full px-4 py-2 text-sm text-[#111827] bg-[#F3F4F6] border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all placeholder:text-[#9CA3AF]"
                />
              </form>

              <ClientOnly>
                <div className="flex items-center gap-3 text-sm">
                  {mounted && isAuthenticated ? (
                    <>
                      <NotificationBell />

                      <Link href="/profile">
                        {user?.name || 'Профиль'}
                      </Link>

                      {isAdmin && (
                        <Link href="/admin">Админка</Link>
                      )}

                      <button onClick={logout}>
                        Выйти
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/login">Войти</Link>
                      <Link href="/auth/register">Регистрация</Link>
                    </>
                  )}
                </div>
              </ClientOnly>
            </div>
          </div>
        </header>

        <main className="min-h-screen py-5">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
