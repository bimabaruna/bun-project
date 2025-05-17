/*
  Warnings:

  - Added the required column `position` to the `employee_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salary` to the `employee_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employee_details" ADD COLUMN     "position" TEXT NOT NULL,
ADD COLUMN     "salary" DECIMAL(65,30) NOT NULL;
