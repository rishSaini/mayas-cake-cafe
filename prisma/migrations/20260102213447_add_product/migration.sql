/*
  Warnings:

  - You are about to drop the column `dietary` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "dietary",
ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
