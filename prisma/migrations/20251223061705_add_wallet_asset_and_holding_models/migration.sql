-- CreateEnum
CREATE TYPE "AssetClass" AS ENUM ('EQUITY', 'FIXED_INCOME', 'REAL_ESTATE', 'FUNDS', 'ETF', 'CASH', 'CRYPTO');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('STOCK', 'BOND', 'GOV_BOND', 'REIT', 'FUND', 'ETF', 'CASH', 'CRYPTO');

-- CreateEnum
CREATE TYPE "CountryCode" AS ENUM ('BR', 'US', 'AU');

-- CreateEnum
CREATE TYPE "CurrencyCode" AS ENUM ('BRL', 'USD', 'AUD');

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ticker" TEXT,
    "class" "AssetClass" NOT NULL,
    "type" "AssetType",
    "country" "CountryCode" NOT NULL,
    "currency" "CurrencyCode" NOT NULL,
    "exchange" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Holding" (
    "id" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "avgPrice" DECIMAL(65,30) NOT NULL,
    "walletId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Holding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Asset_class_idx" ON "Asset"("class");

-- CreateIndex
CREATE INDEX "Asset_type_idx" ON "Asset"("type");

-- CreateIndex
CREATE INDEX "Asset_country_idx" ON "Asset"("country");

-- CreateIndex
CREATE UNIQUE INDEX "Holding_walletId_assetId_key" ON "Holding"("walletId", "assetId");

-- CreateIndex
CREATE UNIQUE INDEX "Holding_walletId_key" ON "Holding"("walletId");

-- CreateIndex
CREATE UNIQUE INDEX "Holding_assetId_key" ON "Holding"("assetId");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holding" ADD CONSTRAINT "Holding_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holding" ADD CONSTRAINT "Holding_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
