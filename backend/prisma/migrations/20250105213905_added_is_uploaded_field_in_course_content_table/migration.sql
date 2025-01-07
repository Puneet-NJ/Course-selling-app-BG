/*
  Warnings:

  - Added the required column `isUploaded` to the `CourseContent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourseContent" ADD COLUMN     "isUploaded" BOOLEAN NOT NULL;
