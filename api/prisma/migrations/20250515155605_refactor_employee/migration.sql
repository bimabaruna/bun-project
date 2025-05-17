/*
  Warnings:

  - You are about to drop the `employees` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_outlet_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_cashier_id_fkey";

-- DropForeignKey
ALTER TABLE "shifts" DROP CONSTRAINT "shifts_employee_id_fkey";

-- DropTable
DROP TABLE "employees";

-- CreateTable
CREATE TABLE "employee_details" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "outlet_id" INTEGER,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "email" TEXT,
    "phone" TEXT,

    CONSTRAINT "employee_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employee_details_user_id_key" ON "employee_details"("user_id");

-- AddForeignKey
ALTER TABLE "employee_details" ADD CONSTRAINT "employee_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_details" ADD CONSTRAINT "employee_details_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_cashier_id_fkey" FOREIGN KEY ("cashier_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
