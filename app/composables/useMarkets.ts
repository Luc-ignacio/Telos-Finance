import type { YieldIntervals } from "~/types";

export function useMarkets() {
  const getAllStocks = async () => {
    const stocksList = await $fetch(`/api/v1/markets/stocks/get-all-stocks`, {
      method: "GET",
    });
    return stocksList;
  };

  const getStockByTicker = async (ticker: string) => {
    const stock = await $fetch(`/api/v1/markets/stocks/${ticker}`, {
      method: "GET",
    });
    return stock;
  };

  const getInterestRateCDI = async (interval: YieldIntervals) => {
    const cdi = await $fetch(
      `/api/v1/markets/interest-rate/get-interest-rate-cdi`,
      {
        method: "GET",
        params: {
          interval: interval,
        },
      },
    );
    return cdi;
  };

  return {
    getAllStocks,
    getStockByTicker,
    getInterestRateCDI,
  };
}
