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

  return {
    getAllStocks,
    getStockByTicker,
  };
}
