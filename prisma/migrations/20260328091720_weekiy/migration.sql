/*
  Warnings:

  - The values [WEEKENDS] on the enum `RecurringPattern` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RecurringPattern_new" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');
ALTER TABLE "Schedule" ALTER COLUMN "recurringPattern" TYPE "RecurringPattern_new" USING ("recurringPattern"::text::"RecurringPattern_new");
ALTER TYPE "RecurringPattern" RENAME TO "RecurringPattern_old";
ALTER TYPE "RecurringPattern_new" RENAME TO "RecurringPattern";
DROP TYPE "public"."RecurringPattern_old";
COMMIT;
