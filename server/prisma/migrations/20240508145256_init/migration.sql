/*
  Warnings:

  - The primary key for the `Level` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Level" DROP CONSTRAINT "Level_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Level_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Level_id_seq";
