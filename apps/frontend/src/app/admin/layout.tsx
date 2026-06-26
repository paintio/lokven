'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-[#F5F7FA]">
        <div className="w-64 bg-white border-r border-[#E5E7EB] min-h-screen p-4 flex-shrink-0" />
        <main className="flex-1 p-6">
          <div className="text-[#9CA3AF]">Загрузка...</div>
        </main>
      </div>
    );
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
