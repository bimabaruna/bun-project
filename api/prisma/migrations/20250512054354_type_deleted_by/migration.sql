/*
  Warnings:

  - You are about to drop the column `delated_by` on the `employees` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "employees" DROP COLUMN "delated_by",
ADD COLUMN     "deleted_by" TEXT;
