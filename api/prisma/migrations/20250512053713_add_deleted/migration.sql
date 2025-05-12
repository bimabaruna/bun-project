-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "delated_by" TEXT,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;
