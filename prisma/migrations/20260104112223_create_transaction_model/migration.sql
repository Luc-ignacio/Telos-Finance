/*
  Warnings:

  - You are about to drop the column `price` on the `Holding` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseDate` on the `Holding` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('BUY', 'SELL', 'DIVIDEND', 'INTEREST');

-- AlterTable
ALTER TABLE "Holding" DROP COLUMN "price",
DROP COLUMN "purchaseDate",
ADD COLUMN     "avgPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
ALTER COLUMN "quantity" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "holdingId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "currency" "CurrencyCode" NOT NULL,
    "tradeDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_holdingId_fkey" FOREIGN KEY ("holdingId") REFERENCES "Holding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
