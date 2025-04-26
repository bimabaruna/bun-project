/*
  Warnings:

  - You are about to drop the column `customer_id` on the `orders` table. All the data in the column will be lost.
  - Added the required column `cashier_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Orderstatus" AS ENUM ('on_progress', 'completed', 'cancelled');

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_customer_id_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "customer_id",
ADD COLUMN     "cashier_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "outlet_id" INTEGER;

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "outlet_id" INTEGER,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outlets" (
    "id" SERIAL NOT NULL,
    "outlet_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "outlets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shifts" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "outlet_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "total_cash" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "shifts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_username_key" ON "employees"("username");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_cashier_id_fkey" FOREIGN KEY ("cashier_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
