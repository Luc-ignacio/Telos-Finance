import { ResponseStatus } from "~~/server/types/api";
import brapi from "../../../../lib/brapi";
import HoldingRepository from "../../../../repo/holdings";
import MarketsRepository from "../../../../repo/markets";
import type { FormattedHolding } from "~/types";
import { AssetClass } from "@prisma/client";

const holdingRepo = new HoldingRepository();
const marketsRepo = new MarketsRepository();

export default defineEventHandler(async (event) => {
  const holdingId = getRouterParam(event, "holdingId");

  if (!holdingId) {
    throw createError("Holding Id is not defined");
  }

  const holding = await holdingRepo.getHoldingById(holdingId);

  if (!holding) {
    throw createError({
      statusCode: ResponseStatus.NOT_FOUND,
      statusMessage: "Holding not found",
    });
  }

  let formattedHolding: FormattedHolding;

  if (
    holding.class === AssetClass.EQUITY ||
    holding.class === AssetClass.REAL_ESTATE
  ) {
    try {
      const res = await brapi.quote.retrieve(holding.ticker!);

      if (res.results) {
        const quote = res.results[0];

        if (quote) {
          const mktValue =
            Number(quote.regularMarketPrice) * Number(holding?.quantity);

          const paidValue =
            Number(holding?.avgPrice) * Number(holding?.quantity);

          const totalReturn = mktValue - paidValue;

          const totalReturnPercentage = (totalReturn * 100) / paidValue;

          return (formattedHolding = {
            ...holding,
            quote: quote || null,
            paidValue: paidValue,
            mktValue: mktValue,
            totalReturn: totalReturn,
            totalReturnPercentage: totalReturnPercentage,
          } as FormattedHolding);
        }
      }
    } catch (error) {
      console.error(
        `Error fetching quote for holding: ${holding.ticker}`,
        error,
      );

      // Fallback: return holding without market data
      const paidValue = Number(holding.avgPrice) * Number(holding.quantity);

      formattedHolding = {
        ...holding,
        quote: null,
        paidValue: paidValue,
        mktValue: paidValue,
        totalReturn: 0,
        totalReturnPercentage: 0,
      } as FormattedHolding;

      return formattedHolding;
    }
  }

  if (holding.class === AssetClass.FIXED_INCOME) {
    try {
      const result =
        await marketsRepo.calculateFixedIncomeValueMultipleTransactions(
          holding,
        );

      const paidValue = result.totalInvested;

      formattedHolding = {
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
      } as FormattedHolding;

      return formattedHolding;
    } catch (error) {
      console.error(
        `Error calculating fixed income for holding ${holding.id}:`,
        error,
      );

      // Fallback: use avgPrice as total invested
      const paidValue = Number(holding.avgPrice);

      formattedHolding = {
        ...holding,
        quote: null,
        paidValue: paidValue,
        grossValue: paidValue,
        netValue: paidValue,
        totalGrossReturn: 0,
        totalNetReturn: 0,
        totalTax: 0,
        totalReturnPercentage: 0,
        fixedIncomeApplications: [],
      } as FormattedHolding;

      return formattedHolding;
    }
  }

  return holding;
});
