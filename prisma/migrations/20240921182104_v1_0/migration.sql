/*
  Warnings:

  - You are about to drop the column `folderId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_folderId_fkey";

-- DropIndex
DROP INDEX "User_folderId_key";

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "user_id" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "folderId";

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
