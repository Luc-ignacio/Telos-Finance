import { ResponseStatus } from "../../../../types/api";
import WalletRepository from "../../../../repo/wallets";
import brapi from "../../../../lib/brapi";
import type { QuoteRetrieveResponse } from "brapi/resources/quote.mjs";

const walletRepo = new WalletRepository();

export default defineEventHandler(async (event) => {
  const walletId = getRouterParam(event, "walletId");

  if (!walletId) {
    throw createError("Wallet Id is not defined");
  }

  const wallet = await walletRepo.getWalletById(walletId);

  if (!wallet) {
    throw createError({
      statusCode: ResponseStatus.NOT_FOUND,
      statusMessage: "Failed to fetch wallet",
    });
  }

  let quotesList = [];

  if (wallet.Holdings.length) {
    const holdingsList = wallet.Holdings.map((item) => item.ticker) || [];

    if (holdingsList.length > 0) {
      for (const holding of holdingsList) {
        try {
          const res = await brapi.quote.retrieve(holding);

          if (res.results) {
            quotesList.push(res.results[0]);
          }
        } catch (error) {
          console.error(`Error fetching quote for holding: ${holding}`, error);
        }
      }
    }
  }

  let formattedHoldings: ((typeof wallet.Holdings)[number] & {
    quote: QuoteRetrieveResponse.Result | null;
    mktValue: number;
    totalReturn: number;
    totalReturnPercentage: number;
  })[] = [];

  if (quotesList.length > 0) {
    formattedHoldings = wallet.Holdings.map((holding) => {
      const quote: QuoteRetrieveResponse.Result | undefined = quotesList.find(
        (item) => item.symbol === holding.ticker
      );

      if (quote) {
        const mktValue =
          Number(quote.regularMarketPrice) * Number(holding.quantity);

        const paidValue = Number(holding.avgPrice) * Number(holding.quantity);

        const totalReturn = mktValue - paidValue;

        const totalReturnPercentage = (totalReturn * 100) / paidValue;

        return {
          ...holding,
          quote: quote || null,
          mktValue: mktValue,
          totalReturn: totalReturn,
          totalReturnPercentage: totalReturnPercentage,
        };
      }
    });
  }

  return {
    ...wallet,
    Holdings: formattedHoldings,
  };
});
