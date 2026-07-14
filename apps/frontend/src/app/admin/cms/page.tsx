'use client';

import Link from 'next/link';

export default function AdminCMS() {
  const sections = [
    {
      title: '📄 Страницы',
      description: 'Управление страницами (О нас, Контакты, Правила и т.д.)',
      href: '/admin/cms/pages',
      icon: '📄'
    },
    {
      title: '🔗 Футер ссылки',
      description: 'Управление ссылками в футере',
      href: '/admin/cms/footer',
      icon: '🔗'
    },
    {
      title: '⚙️ Настройки CMS',
      description: 'Контентные значения и настройки интеграций',
      href: '/admin/cms/settings',
      icon: '⚙️'
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111827] mb-6">📝 Управление контентом</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="bg-white rounded-xl p-6 border border-[#E5E7EB] hover:border-[#3B82F6] hover:shadow-md transition-all"
          >
            <div className="text-3xl mb-2">{section.icon}</div>
            <h3 className="font-semibold text-[#111827]">{section.title}</h3>
            <p className="text-sm text-[#6B7280] mt-1">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
