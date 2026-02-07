/*
  Warnings:

  - You are about to drop the column `userId` on the `Survey` table. All the data in the column will be lost.
  - Added the required column `propertyId` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Survey" DROP CONSTRAINT "Survey_userId_fkey";

-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "userId",
ADD COLUMN     "propertyId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subtype" TEXT NOT NULL,
    "managementModel" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "sizeSqFt" INTEGER NOT NULL,
    "class" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
