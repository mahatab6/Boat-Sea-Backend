/*
  Warnings:

  - You are about to drop the column `seatNumbers` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `endLat` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `endLng` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `endLocation` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedDuration` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `popularTimes` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `routeName` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `startLat` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `startLng` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `startLocation` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `waypoints` on the `Route` table. All the data in the column will be lost.
  - You are about to alter the column `distance` on the `Route` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `VarChar(20)`.
  - You are about to drop the column `price` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `seatNumber` on the `Seat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeEventId]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[scheduleId,totalGuests]` on the table `Seat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Boat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specifications` to the `Boat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalGuests` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tripDate` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scenicHighlights` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalGuests` to the `Seat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "BoatStatus" ADD VALUE 'Booked';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BoatType" ADD VALUE 'YACHT';
ALTER TYPE "BoatType" ADD VALUE 'Speedboat';
ALTER TYPE "BoatType" ADD VALUE 'CATAMARAN';

-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'UNPAID';

-- DropIndex
DROP INDEX "Seat_scheduleId_seatNumber_key";

-- AlterTable
ALTER TABLE "Boat" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "primary_img" TEXT,
ADD COLUMN     "specifications" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "seatNumbers",
ADD COLUMN     "totalGuests" INTEGER NOT NULL,
ADD COLUMN     "tripDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "stripeEventId" TEXT;

-- AlterTable
ALTER TABLE "Route" DROP COLUMN "endLat",
DROP COLUMN "endLng",
DROP COLUMN "endLocation",
DROP COLUMN "estimatedDuration",
DROP COLUMN "isActive",
DROP COLUMN "popularTimes",
DROP COLUMN "routeName",
DROP COLUMN "startLat",
DROP COLUMN "startLng",
DROP COLUMN "startLocation",
DROP COLUMN "waypoints",
ADD COLUMN     "duration" VARCHAR(50) NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" VARCHAR(150) NOT NULL,
ADD COLUMN     "scenicHighlights" VARCHAR(255) NOT NULL,
ALTER COLUMN "distance" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "seatNumber",
ADD COLUMN     "totalGuests" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payments_stripeEventId_key" ON "Payments"("stripeEventId");

-- CreateIndex
CREATE UNIQUE INDEX "Seat_scheduleId_totalGuests_key" ON "Seat"("scheduleId", "totalGuests");
