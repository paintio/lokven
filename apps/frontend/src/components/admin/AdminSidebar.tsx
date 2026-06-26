'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/admin', label: 'Дашборд' },
  { href: '/admin/analytics', label: 'Аналитика' },
  { href: '/admin/users', label: 'Пользователи' },
  { href: '/admin/listings', label: 'Объявления' },
  { href: '/admin/categories', label: 'Категории' },
  { href: '/admin/reviews', label: 'Отзывы' },
  { href: '/admin/orders', label: 'Заказы' },
  { href: '/admin/payments', label: 'Платежи' },
  { href: '/admin/taxes', label: 'Налоги' },
  { href: '/admin/cms', label: 'Контент' },
  { href: '/admin/cms/pages', label: 'Страницы' },
  { href: '/admin/cms/footer', label: 'Футер' },
  { href: '/admin/notifications', label: 'Рассылка' },
  { href: '/admin/settings', label: 'Настройки' },
  { href: '/admin/export', label: 'Экспорт' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-[#E5E7EB] min-h-screen p-4 flex-shrink-0 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-wider">Админка</h2>
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#F3F4F6] text-[#111827] font-medium'
                  : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]'
              }`}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
