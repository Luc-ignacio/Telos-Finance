/*
  Warnings:

  - Added the required column `purchaseDate` to the `Holding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Holding" ADD COLUMN     "purchaseDate" TIMESTAMP(3) NOT NULL;
