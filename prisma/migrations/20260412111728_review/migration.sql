/*
  Warnings:

  - You are about to drop the column `commont` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "commont",
ADD COLUMN     "comment" TEXT;
