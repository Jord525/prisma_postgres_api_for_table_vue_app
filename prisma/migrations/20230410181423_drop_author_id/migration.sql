/*
  Warnings:

  - You are about to drop the column `authorId` on the `Table` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Table" DROP CONSTRAINT "Table_authorId_fkey";

-- AlterTable
ALTER TABLE "Table" DROP COLUMN "authorId";
