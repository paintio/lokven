'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/auth/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role === 'admin') {
        setIsAdmin(true);
      } else {
        router.push('/');
      }
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F7FA]">
        <div className="text-[#9CA3AF]">Проверка прав...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <AdminSidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}