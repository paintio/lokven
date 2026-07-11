-- Очистить таблицу
TRUNCATE TABLE "footer_links" RESTART IDENTITY;

-- Вставить группы
INSERT INTO "footer_links" ("id", "group", "label", "url", "icon", "order", "isActive", "createdAt", "updatedAt") VALUES
  (gen_random_uuid()::text, 'Социальные сети', 'Социальные сети', '#', NULL, 1, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'О компании', 'О компании', '#', NULL, 2, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Покупателям', 'Покупателям', '#', NULL, 3, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Продавцам', 'Продавцам', '#', NULL, 4, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Помощь', 'Помощь', '#', NULL, 5, true, NOW(), NOW());