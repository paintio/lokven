'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ProfileSidebarProps {
  role: string;
  isSeller: boolean;
}

export default function ProfileSidebar({ role, isSeller }: ProfileSidebarProps) {
  const pathname = usePathname();

  // Админ видит всё
  const isAdmin = role === 'admin';

  const buyerMenu = [
    { href: '/profile', label: 'Обзор' },
    { href: '/profile/orders', label: 'Мои заказы' },
    { href: '/profile/favorites', label: 'Избранное' },
    { href: '/profile/reviews', label: 'Мои отзывы' },
    { href: '/profile/settings', label: 'Настройки' },
  ];

  const sellerMenu = [
    { href: '/profile', label: 'Обзор' },
    { href: '/profile/listings', label: 'Мои объявления' },
    { href: '/profile/orders', label: 'Заказы' },
    { href: '/profile/analytics', label: 'Аналитика' },
    { href: '/profile/settings', label: 'Настройки' },
  ];

  const employerMenu = [
    { href: '/profile', label: 'Обзор' },
    { href: '/profile/vacancies', label: 'Мои вакансии' },
    { href: '/profile/responses', label: 'Отклики' },
    { href: '/profile/company', label: 'Компания' },
    { href: '/profile/settings', label: 'Настройки' },
  ];

  const performerMenu = [
    { href: '/profile', label: 'Обзор' },
    { href: '/profile/services', label: 'Мои услуги' },
    { href: '/profile/orders', label: 'Заказы' },
    { href: '/profile/balance', label: 'Баланс' },
    { href: '/profile/settings', label: 'Настройки' },
  ];

  // Выбор меню в зависимости от роли
  let menu = buyerMenu;
  if (isAdmin) {
    // Админ видит все меню в одном списке
    menu = [
      ...buyerMenu,
      ...sellerMenu.filter(m => m.label !== 'Обзор' && m.label !== 'Настройки'),
      ...employerMenu.filter(m => m.label !== 'Обзор' && m.label !== 'Настройки'),
      ...performerMenu.filter(m => m.label !== 'Обзор' && m.label !== 'Настройки'),
    ];
    // Убираем дубликаты
    const uniqueMenu = menu.filter((item, index, self) => 
      self.findIndex(m => m.href === item.href) === index
    );
    menu = uniqueMenu;
  } else if (role === 'employer') {
    menu = employerMenu;
  } else if (role === 'performer') {
    menu = performerMenu;
  } else if (isSeller) {
    menu = sellerMenu;
  }

  return (
    <aside className="w-64 bg-white rounded-xl border border-[#E5E7EB] p-4 sticky top-20">
      <nav className="space-y-1">
        {menu.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#F3F4F6] text-[#111827] font-medium'
                  : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
