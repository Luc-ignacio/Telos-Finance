import brapi from "../../../lib/brapi";
import type { QuoteRetrieveResponse } from "brapi/resources/quote.mjs";
import HoldingRepository from "../../../repo/holdings";
import type { FormattedHolding } from "~/types";

const holdingRepo = new HoldingRepository();

export default defineEventHandler(async (event) => {
  const holdingId = getRouterParam(event, "holdingId");

  if (!holdingId) {
    throw createError("Holding Id is not defined");
  }

  const holding = await holdingRepo.getHoldingById(holdingId);

  let formattedHolding;

  try {
    const res = await brapi.quote.retrieve(holding?.ticker);

    if (res.results) {
      const quote = res.results[0];

      if (quote) {
        const mktValue =
          Number(quote.regularMarketPrice) * Number(holding?.quantity);

        const paidValue = Number(holding?.avgPrice) * Number(holding?.quantity);

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
    console.error(`Error fetching quote for holding: ${holding}`, error);
  }

  return holding;
});
