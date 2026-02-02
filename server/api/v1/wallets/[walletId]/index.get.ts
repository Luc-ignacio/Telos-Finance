import { ResponseStatus } from "../../../../types/api";
import WalletRepository from "../../../../repo/wallets";
import MarketsRepository from "../../../../repo/markets";
import brapi from "../../../../lib/brapi";
import type { QuoteRetrieveResponse } from "brapi/resources/quote.mjs";
import type { FormattedHolding } from "~/types";
import { AssetClass } from "@prisma/client";

const walletRepo = new WalletRepository();
const marketsRepo = new MarketsRepository();

export default defineEventHandler(async (event) => {
  const walletId = getRouterParam(event, "walletId");

  if (!walletId) {
    throw createError("Wallet Id is not defined");
  }

  const wallet = await walletRepo.getWalletById(walletId);

  if (!wallet) {
    throw createError({
      statusCode: ResponseStatus.NOT_FOUND,
      statusMessage: "Wallet not found",
    });
  }

  let formattedHoldings: FormattedHolding[] = [];

  let totalInvested = 0;
  let totalValue = 0;

  // If holding class is EQUITY or REAL_STATE
  const equityOrRealEstateHoldings = wallet.Holdings.filter(
    (holding) =>
      holding.class === AssetClass.EQUITY ||
      holding.class === AssetClass.REAL_ESTATE,
  );

  if (equityOrRealEstateHoldings.length > 0) {
    const stocksList = equityOrRealEstateHoldings
      .map((item) => item.ticker)
      .filter((ticker): ticker is string => ticker !== null);

    let quotesList: QuoteRetrieveResponse.Result[] = [];

    if (stocksList.length > 0) {
      for (const stock of stocksList) {
        try {
          const res = await brapi.quote.retrieve(stock);
          if (res.results) {
            quotesList.push(res.results[0]);
          }
        } catch (error) {
          console.error(`Error fetching quote for stock: ${stock}`, error);
        }
      }
    }

    for (const holding of equityOrRealEstateHoldings) {
      const quote = quotesList.find((item) => item.symbol === holding.ticker);

      if (quote) {
        const mktValue =
          Number(quote.regularMarketPrice) * Number(holding.quantity);
        const paidValue = Number(holding.avgPrice) * Number(holding.quantity);
        const totalReturn = mktValue - paidValue;
        const totalReturnPercentage =
          paidValue > 0 ? (totalReturn * 100) / paidValue : 0;

        totalInvested += paidValue;
        totalValue += mktValue;

        formattedHoldings.push({
          ...holding,
          quote: quote || null,
          paidValue: paidValue,
          mktValue: mktValue,
          totalReturn: totalReturn,
          totalReturnPercentage: totalReturnPercentage,
        });
      }
    }
  }

  // If holding class is FIXED_INCOME
  const fixedIncomeHoldings = wallet.Holdings.filter(
    (holding) => holding.class === AssetClass.FIXED_INCOME,
  );

  for (const holding of fixedIncomeHoldings) {
    try {
      const result =
        await marketsRepo.calculateFixedIncomeValueMultipleTransactions(
          holding,
        );

      const paidValue = result.totalInvested;
      const mktValue = result.totalNetValue;

      totalInvested += paidValue;
      totalValue += mktValue;

      formattedHoldings.push({
        ...holding,
        quote: null,
        paidValue: paidValue,
        grossValue: result.totalGrossValue,
        netValue: result.totalNetValue,
        totalGrossReturn: result.totalGrossReturn,
        totalNetReturn: result.totalNetReturn,
        totalTax: result.totalTax,
        totalReturnPercentage: result.totalReturnPercentage,
        fixedIncomeApplications: result.applications,
      });
    } catch (error) {
      console.error(
        `Error calculating fixed income for holding ${holding.id}:`,
        error,
      );

      // Fallback: use avgPrice as total invested
      const paidValue = Number(holding.avgPrice);
      totalInvested += paidValue;
      totalValue += paidValue;

      formattedHoldings.push({
        ...holding,
        quote: null,
        paidValue: paidValue,
        mktValue: paidValue,
        totalReturn: 0,
        totalReturnPercentage: 0,
      });
    }
  }

  const totalReturn = totalValue - totalInvested;
  const totalReturnPercentage = (totalReturn * 100) / totalInvested;

  return {
    ...wallet,
    totalInvested: totalInvested,
    totalValue: totalValue,
    totalReturn: totalReturn,
    totalReturnPercentage: totalReturnPercentage,
    Holdings: formattedHoldings,
  };
});
