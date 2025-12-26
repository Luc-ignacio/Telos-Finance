import brapi from "../../../../lib/brapi";

export default defineEventHandler(async (event) => {
  const ticker = getRouterParam(event, "ticker");

  if (!ticker) {
    throw createError("Ticker is not defined");
  }
  const response = await brapi.quote.retrieve(ticker, {
    modules: ["summaryProfile"],
  });

  let stock;
  if (response.results) {
    stock = response.results[0];
  }

  return stock;
});
