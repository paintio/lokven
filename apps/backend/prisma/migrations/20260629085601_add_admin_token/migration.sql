-- AlterTable
ALTER TABLE "User" ADD COLUMN     "adminToken" TEXT,
ADD COLUMN     "adminTokenExpiry" TIMESTAMP(3);
