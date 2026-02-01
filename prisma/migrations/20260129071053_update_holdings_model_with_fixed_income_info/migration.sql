-- CreateEnum
CREATE TYPE "FixedIncomeIndexer" AS ENUM ('CDI', 'SELIC', 'IPCA', 'FIXED_RATE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransactionType" ADD VALUE 'REDEMPTION';
ALTER TYPE "TransactionType" ADD VALUE 'MATURITY';

-- AlterTable
ALTER TABLE "Holding" ADD COLUMN     "fixedIncomeIndexer" "FixedIncomeIndexer",
ADD COLUMN     "fixedIncomeMaturityDate" TIMESTAMP(3),
ADD COLUMN     "fixedIncomePurchaseDate" TIMESTAMP(3),
ADD COLUMN     "fixedIncomeRate" DECIMAL(65,30);
