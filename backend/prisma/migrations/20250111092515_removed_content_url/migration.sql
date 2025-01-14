/*
  Warnings:

  - You are about to drop the column `contentUrl` on the `CourseContent` table. All the data in the column will be lost.
  - You are about to drop the column `isUploaded` on the `CourseContent` table. All the data in the column will be lost.
  - Added the required column `status` to the `CourseContent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('PROCESSING', 'PROCESSED', 'PENDING', 'FAILED');

-- AlterTable
ALTER TABLE "CourseContent" DROP COLUMN "contentUrl",
DROP COLUMN "isUploaded",
ADD COLUMN     "status" "ContentStatus" NOT NULL;
