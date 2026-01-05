/*
  Warnings:

  - You are about to drop the column `assetId` on the `Holding` table. All the data in the column will be lost.
  - You are about to drop the `Asset` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[walletId,ticker]` on the table `Holding` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `class` to the `Holding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Holding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Holding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Holding` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Holding" DROP CONSTRAINT "Holding_assetId_fkey";

-- DropIndex
DROP INDEX "Holding_assetId_key";

-- DropIndex
DROP INDEX "Holding_walletId_assetId_key";

-- DropIndex
DROP INDEX "Holding_walletId_key";

-- AlterTable
ALTER TABLE "Holding" DROP COLUMN "assetId",
ADD COLUMN     "class" "AssetClass" NOT NULL,
ADD COLUMN     "country" "CountryCode" NOT NULL,
ADD COLUMN     "currency" "CurrencyCode" NOT NULL,
ADD COLUMN     "exchange" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "ticker" TEXT,
ADD COLUMN     "type" "AssetType";

-- DropTable
DROP TABLE "Asset";

-- CreateIndex
CREATE UNIQUE INDEX "Holding_walletId_ticker_key" ON "Holding"("walletId", "ticker");
