import brapi from "../../../../../lib/brapi";

export default defineEventHandler(async (event) => {
  const stocks = getRouterParam(event, "stocks");

  if (!stocks) {
    throw createError("Stocks are not defined");
  }

  let response = [];

  for (const stock of stocks.split(",")) {
    try {
      const res = await brapi.quote.retrieve(stock);

      if (res.results) {
        response.push(res.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching quote for stock: ${stock}`, error);
    }
  }

  return response;
});
