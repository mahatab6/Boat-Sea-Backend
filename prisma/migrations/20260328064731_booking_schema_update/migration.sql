/*
  Warnings:

  - You are about to drop the `_BoatToBooking` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `boatId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_BoatToBooking" DROP CONSTRAINT "_BoatToBooking_A_fkey";

-- DropForeignKey
ALTER TABLE "_BoatToBooking" DROP CONSTRAINT "_BoatToBooking_B_fkey";

-- DropIndex
DROP INDEX "Booking_userId_key";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "boatId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_BoatToBooking";

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_boatId_fkey" FOREIGN KEY ("boatId") REFERENCES "Boat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
