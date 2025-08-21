CREATE EXTENSION IF NOT EXISTS citext;

/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `SocialAccount` table. All the data in the column will be lost.
  - You are about to drop the column `done` on the `Subtask` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Subtask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "public"."File" DROP CONSTRAINT "File_taskId_fkey";

-- DropIndex
DROP INDEX "public"."ProjectMember_userId_idx";

-- DropIndex
DROP INDEX "public"."Task_dueDate_idx";

-- AlterTable
ALTER TABLE "public"."Invitation" ADD COLUMN     "status" "public"."InvitationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."SocialAccount" DROP COLUMN "imageUrl",
ADD COLUMN     "profileImage" TEXT;

-- AlterTable
ALTER TABLE "public"."Subtask" DROP COLUMN "done",
ADD COLUMN     "status" "public"."TaskStatus" NOT NULL DEFAULT 'TODO',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "dueDate",
DROP COLUMN "tags",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "imageUrl",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "refreshTokenVersion" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "email" SET DATA TYPE CITEXT;

-- DropTable
DROP TABLE "public"."File";

-- CreateTable
CREATE TABLE "public"."Attachments" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "originalName" TEXT NOT NULL,
    "storedName" TEXT NOT NULL,
    "relPath" TEXT NOT NULL,
    "mimeType" TEXT,
    "size" INTEGER,
    "ext" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TaskTag" (
    "taskId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "TaskTag_pkey" PRIMARY KEY ("taskId","tagId")
);

-- CreateIndex
CREATE INDEX "Attachments_taskId_idx" ON "public"."Attachments"("taskId");

-- CreateIndex
CREATE INDEX "Attachments_storedName_idx" ON "public"."Attachments"("storedName");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "public"."Tag"("name");

-- CreateIndex
CREATE INDEX "Project_name_idx" ON "public"."Project"("name");

-- CreateIndex
CREATE INDEX "ProjectMember_projectId_idx" ON "public"."ProjectMember"("projectId");

-- AddForeignKey
ALTER TABLE "public"."Attachments" ADD CONSTRAINT "Attachments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TaskTag" ADD CONSTRAINT "TaskTag_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TaskTag" ADD CONSTRAINT "TaskTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
