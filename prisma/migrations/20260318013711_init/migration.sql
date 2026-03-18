-- CreateEnum
CREATE TYPE "BoatType" AS ENUM ('SPEEDBOAT', 'FERRY', 'LAUNCH', 'PRIVATE');

-- CreateEnum
CREATE TYPE "BoatStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'SUSPENDED');

-- CreateTable
CREATE TABLE "Boat" (
    "id" TEXT NOT NULL,
    "boatName" VARCHAR(150) NOT NULL,
    "boatType" "BoatType" NOT NULL,
    "status" "BoatStatus" NOT NULL,
    "capacity" INTEGER NOT NULL,
    "ownerId" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "licenseExpiry" TIMESTAMP(3) NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "boatCondition" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "pricePerTrip" INTEGER NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "engineCapacity" INTEGER NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "manufacturingYear" INTEGER NOT NULL,
    "amenities" TEXT[],
    "cancellationPolicy" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Boat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Boat_registrationNumber_key" ON "Boat"("registrationNumber");
