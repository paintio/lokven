'use client';

import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-[#111827] mb-2">Что-то пошло не так</h1>
        <p className="text-[#6B7280] mb-6">Попробуйте обновить страницу или вернуться позже</p>
        <Link href="/" className="btn-primary">
          На главную
        </Link>
      </div>
    </div>
  );
}
