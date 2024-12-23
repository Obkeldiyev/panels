/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Tracking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tracking" DROP COLUMN "updatedAt",
ADD COLUMN     "stopTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
