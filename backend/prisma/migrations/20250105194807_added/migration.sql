-- CreateTable
CREATE TABLE "CourseFolder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "CourseFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseContent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "courseFolderId" TEXT NOT NULL,

    CONSTRAINT "CourseContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseFolder_courseId_name_key" ON "CourseFolder"("courseId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "CourseContent_courseFolderId_name_key" ON "CourseContent"("courseFolderId", "name");

-- AddForeignKey
ALTER TABLE "CourseFolder" ADD CONSTRAINT "CourseFolder_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseContent" ADD CONSTRAINT "CourseContent_courseFolderId_fkey" FOREIGN KEY ("courseFolderId") REFERENCES "CourseFolder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
