/*
  Warnings:

  - You are about to drop the `PageSection` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[group,label]` on the table `FooterLink` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PageSection" DROP CONSTRAINT "PageSection_pageId_fkey";

-- DropTable
DROP TABLE "PageSection";

-- CreateIndex
CREATE UNIQUE INDEX "FooterLink_group_label_key" ON "FooterLink"("group", "label");
