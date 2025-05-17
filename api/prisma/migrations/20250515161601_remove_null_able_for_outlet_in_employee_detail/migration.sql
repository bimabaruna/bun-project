/*
  Warnings:

  - Made the column `outlet_id` on table `employee_details` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "employee_details" DROP CONSTRAINT "employee_details_outlet_id_fkey";

-- AlterTable
ALTER TABLE "employee_details" ALTER COLUMN "outlet_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "employee_details" ADD CONSTRAINT "employee_details_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
