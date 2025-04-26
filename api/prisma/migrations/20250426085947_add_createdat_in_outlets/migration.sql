-- AlterTable
ALTER TABLE "outlets" ADD COLUMN     "craetedBy" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" TEXT;
