import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Заполняем футер ссылками...');

  const footerLinks = [
    // О компании
    { group: 'about', label: 'О нас', url: '/about', order: 1 },
    { group: 'about', label: 'Вакансии', url: '/jobs', order: 2 },
    { group: 'about', label: 'Контакты', url: '/contacts', order: 3 },
    { group: 'about', label: 'Блог', url: '/blog', order: 4 },

    // Покупателям
    { group: 'buyers', label: 'Как купить', url: '/how-to-buy', order: 1 },
    { group: 'buyers', label: 'Доставка', url: '/delivery', order: 2 },
    { group: 'buyers', label: 'Возврат', url: '/return', order: 3 },
    { group: 'buyers', label: 'Гарантия', url: '/guarantee', order: 4 },

    // Продавцам
    { group: 'sellers', label: 'Как продавать', url: '/how-to-sell', order: 1 },
    { group: 'sellers', label: 'Тарифы', url: '/tariffs', order: 2 },
    { group: 'sellers', label: 'Продвижение', url: '/promotion', order: 3 },
    { group: 'sellers', label: 'API', url: '/api-docs', order: 4 },

    // Помощь
    { group: 'help', label: 'FAQ', url: '/faq', order: 1 },
    { group: 'help', label: 'Поддержка', url: '/support', order: 2 },
    { group: 'help', label: 'Безопасность', url: '/security', order: 3 },
    { group: 'help', label: 'Правила', url: '/rules', order: 4 },
  ];

  for (const link of footerLinks) {
    // Проверяем, существует ли запись
    const existing = await prisma.footerLink.findFirst({
      where: {
        group: link.group,
        label: link.label,
      },
    });

    if (existing) {
      // Обновляем существующую
      await prisma.footerLink.update({
        where: { id: existing.id },
        data: {
          url: link.url,
          order: link.order,
          isActive: true,
        },
      });
      console.log(`✅ Обновлено: ${link.group} -> ${link.label}`);
    } else {
      // Создаем новую
      await prisma.footerLink.create({
        data: {
          group: link.group,
          label: link.label,
          url: link.url,
          order: link.order,
          isActive: true,
        },
      });
      console.log(`✅ Создано: ${link.group} -> ${link.label}`);
    }
  }

  console.log('\n🎉 Футер успешно заполнен!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
