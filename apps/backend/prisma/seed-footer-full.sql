-- Очистить таблицу
TRUNCATE TABLE "footer_links" RESTART IDENTITY;

-- Вставить все ссылки
INSERT INTO "footer_links" ("id", "group", "label", "url", "icon", "order", "isActive", "createdAt", "updatedAt") VALUES
  -- Социальные сети (с иконками)
  (gen_random_uuid()::text, 'Социальные сети', 'VK', 'https://vk.com/lokven', 'vk', 1, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Социальные сети', 'Telegram', 'https://t.me/lokven', 'telegram', 2, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Социальные сети', 'YouTube', 'https://youtube.com/@lokven', 'youtube', 3, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Социальные сети', 'Instagram', 'https://instagram.com/lokven', 'instagram', 4, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Социальные сети', 'TikTok', 'https://tiktok.com/@lokven', 'tiktok', 5, true, NOW(), NOW()),

  -- О компании
  (gen_random_uuid()::text, 'О компании', 'О нас', '/about', NULL, 1, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'О компании', 'Вакансии', '/jobs', NULL, 2, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'О компании', 'Блог', '/blog', NULL, 3, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'О компании', 'Контакты', '/contacts', NULL, 4, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'О компании', 'Политика конфиденциальности', '/privacy', NULL, 5, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'О компании', 'Партнерам', '/partners', NULL, 6, true, NOW(), NOW()),

  -- Покупателям
  (gen_random_uuid()::text, 'Покупателям', 'Как покупать', '/help/buyer', NULL, 1, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Покупателям', 'Доставка', '/help/delivery', NULL, 2, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Покупателям', 'Оплата', '/help/payment', NULL, 3, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Покупателям', 'Возврат', '/help/return', NULL, 4, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Покупателям', 'Гарантии', '/help/warranty', NULL, 5, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Покупателям', 'Отзывы', '/reviews', NULL, 6, true, NOW(), NOW()),

  -- Продавцам
  (gen_random_uuid()::text, 'Продавцам', 'Как продавать', '/help/seller', NULL, 1, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Продавцам', 'Разместить объявление', '/listings/create', NULL, 2, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Продавцам', 'Тарифы', '/pricing', NULL, 3, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Продавцам', 'Продвижение', '/help/promotion', NULL, 4, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Продавцам', 'Аналитика', '/analytics', NULL, 5, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Продавцам', 'Помощь продавцу', '/help/seller-faq', NULL, 6, true, NOW(), NOW()),

  -- Помощь
  (gen_random_uuid()::text, 'Помощь', 'FAQ', '/help/faq', NULL, 1, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Помощь', 'Правила использования', '/rules', NULL, 2, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Помощь', 'Пользовательское соглашение', '/terms', NULL, 3, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Помощь', 'Безопасность', '/help/security', NULL, 4, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Помощь', 'Служба поддержки', '/support', NULL, 5, true, NOW(), NOW());