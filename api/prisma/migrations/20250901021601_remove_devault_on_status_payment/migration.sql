/*
  Warnings:

  - Made the column `status` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "status" SET NOT NULL;
