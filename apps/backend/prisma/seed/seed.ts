import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...');

  // 1. Создаем категории
  console.log('📂 Создаем категории...');
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Авто', slug: 'avto', icon: '🚗', order: 1, isActive: true },
      { name: 'Электроника', slug: 'elektronika', icon: '📱', order: 2, isActive: true },
      { name: 'Недвижимость', slug: 'nedvizhimost', icon: '🏠', order: 3, isActive: true },
      { name: 'Услуги', slug: 'uslugi', icon: '🔧', order: 4, isActive: true },
      { name: 'Для дома и сада', slug: 'dom-i-sad', icon: '🏡', order: 5, isActive: true },
      { name: 'Спорт и отдых', slug: 'sport-i-otdyh', icon: '⚽', order: 6, isActive: true },
      { name: 'Медиа и стиль', slug: 'media-i-stil', icon: '👕', order: 7, isActive: true },
      { name: 'Работа', slug: 'rabota', icon: '💼', order: 8, isActive: true },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Создано ${categories.count} категорий`);

  // 2. Создаем налоги
  console.log('💰 Создаем налоги...');
  const taxes = await prisma.tax.createMany({
    data: [
      { name: 'НДС', rate: 20, type: 'vat', isActive: true },
      { name: 'Подоходный налог', rate: 13, type: 'income', isActive: true },
      { name: 'Налог на услуги', rate: 6, type: 'service', isActive: true },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Создано ${taxes.count} налогов`);

  // 3. Создаем настройки
  console.log('⚙️ Создаем настройки...');
  const settings = await prisma.siteSettings.createMany({
    data: [
      { key: 'commissionRate', value: 5, group: 'general', description: 'Комиссия платформы в %' },
      { key: 'moderationEnabled', value: true, group: 'moderation', description: 'Включить модерацию' },
      { key: 'premiumPrice', value: 1000, group: 'payments', description: 'Цена премиум-объявления' },
      { key: 'siteName', value: 'Локвен', group: 'general', description: 'Название сайта' },
      { key: 'siteDescription', value: 'Маркетплейс, доска объявлений, авто и услуги', group: 'general', description: 'Описание сайта' },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Создано ${settings.count} настроек`);

  // 4. Создаем админа с паролем
  console.log('👤 Создаем администратора...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { phone: '+79991234567' },
    update: {},
    create: {
      phone: '+79991234567',
      password: hashedPassword,
      name: 'Администратор',
      role: 'admin',
      isBlocked: false,
      isVerified: true,
      email: 'admin@lokven.ru',
    },
  });
  console.log('✅ Администратор создан (пароль: admin123)');

  // 5. Создаем тестовые объявления
  console.log('📋 Создаем тестовые объявления...');
  
  const listings = await prisma.listing.createMany({
    data: [
      {
        title: 'Toyota Camry 2020',
        description: 'Отличное состояние, полный привод, климат-контроль, пробег 45 000 км',
        price: 2500000,
        currency: 'RUB',
        type: 'auto',
        attributes: { brand: 'Toyota', model: 'Camry', year: 2020, mileage: 45000, engine: '2.5', transmission: 'automatic' },
        status: 'active',
        views: 150,
        authorId: admin.id,
        address: 'Москва, ул. Тверская, 1',
        lat: 55.7558,
        lng: 37.6176,
      },
      {
        title: 'iPhone 15 Pro Max 256GB',
        description: 'Новый, гарантия, полный комплект, цвет Natural Titanium',
        price: 120000,
        currency: 'RUB',
        type: 'product',
        attributes: { brand: 'Apple', model: 'iPhone 15 Pro Max', storage: '256GB', color: 'Natural Titanium', condition: 'new' },
        status: 'active',
        views: 230,
        authorId: admin.id,
        address: 'Москва, ул. Тверская, 1',
        lat: 55.7558,
        lng: 37.6176,
      },
      {
        title: 'Квартира в центре Москвы',
        description: '3-комнатная, 85 м², свежий ремонт, высокий потолок',
        price: 15000000,
        currency: 'RUB',
        type: 'product',
        attributes: { type: 'apartment', rooms: 3, area: 85, floor: 5, total_floors: 12, condition: 'renovated' },
        status: 'active',
        views: 89,
        authorId: admin.id,
        address: 'Москва, ул. Тверская, 1',
        lat: 55.7558,
        lng: 37.6176,
      },
      {
        title: 'Ремонт iPhone в день обращения',
        description: 'Быстрый и качественный ремонт любых моделей iPhone. Гарантия 3 месяца.',
        price: 3000,
        currency: 'RUB',
        type: 'service',
        attributes: { category: 'repair', device: 'iPhone', warranty: '3 months', time: '1 hour' },
        status: 'active',
        views: 45,
        authorId: admin.id,
        address: 'Москва, ул. Тверская, 1',
        lat: 55.7558,
        lng: 37.6176,
      },
      {
        title: 'BMW X5 2021',
        description: 'Дизель, полный привод, кожаный салон, пробег 30 000 км',
        price: 4500000,
        currency: 'RUB',
        type: 'auto',
        attributes: { brand: 'BMW', model: 'X5', year: 2021, mileage: 30000, engine: '3.0', transmission: 'automatic' },
        status: 'active',
        views: 310,
        authorId: admin.id,
        address: 'Москва, ул. Тверская, 1',
        lat: 55.7558,
        lng: 37.6176,
      },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Создано ${listings.count} тестовых объявлений`);

  console.log('🎉 База данных успешно заполнена!');
  console.log('📝 Данные для входа:');
  console.log('   Телефон: +79991234567');
  console.log('   Пароль: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
