-- DropForeignKey
ALTER TABLE "Purchases" DROP CONSTRAINT "Purchases_courseId_fkey";

-- AddForeignKey
ALTER TABLE "Purchases" ADD CONSTRAINT "Purchases_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
