/*
  Warnings:

  - You are about to drop the column `token` on the `AdminUsbToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tokenHash]` on the table `AdminUsbToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenHash` to the `AdminUsbToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AdminUsbToken_token_key";

-- AlterTable
ALTER TABLE "AdminUsbToken" DROP COLUMN "token",
ADD COLUMN     "deviceId" TEXT,
ADD COLUMN     "tokenHash" TEXT NOT NULL,
ADD COLUMN     "usedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "AdminSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "deviceId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_token_key" ON "AdminSession"("token");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUsbToken_tokenHash_key" ON "AdminUsbToken"("tokenHash");
