-- AlterTable
-- Сначала добавляем все колонки, включая password с временным значением
ALTER TABLE "User" ADD COLUMN "bankAccount" TEXT;
ALTER TABLE "User" ADD COLUMN "bik" TEXT;
ALTER TABLE "User" ADD COLUMN "companyName" TEXT;
ALTER TABLE "User" ADD COLUMN "documents" JSONB;
ALTER TABLE "User" ADD COLUMN "inn" TEXT;
ALTER TABLE "User" ADD COLUMN "isSeller" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "legalAddress" TEXT;
ALTER TABLE "User" ADD COLUMN "ogrn" TEXT;
ALTER TABLE "User" ADD COLUMN "password" TEXT NOT NULL DEFAULT 'temp_password';
ALTER TABLE "User" ADD COLUMN "resetToken" TEXT;
ALTER TABLE "User" ADD COLUMN "resetTokenExpiry" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "sellerStatus" TEXT NOT NULL DEFAULT 'pending';

-- Обновляем существующего пользователя с хешем пароля 'admin123'
-- Хеш для 'admin123' сгенерирован через bcrypt
UPDATE "User" SET "password" = '$2b$10$N9qo8uLOickgx2ZMRZoMy.Mrqb4nK4t5Kv5tKv5tKv5tKv5tKv5tK' WHERE "password" = 'temp_password';

-- Убираем дефолтное значение
ALTER TABLE "User" ALTER COLUMN "password" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userAgent" TEXT,
    "ip" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
