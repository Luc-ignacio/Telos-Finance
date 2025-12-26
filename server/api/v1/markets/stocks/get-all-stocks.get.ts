import brapi from "../../../../lib/brapi";

export default defineEventHandler(async (event) => {
  const response = await brapi.quote.list();

  const stocksList = response.stocks?.filter(
    (item) => item.type === "stock" && !item.stock?.endsWith("F")
  );
  const fundsList = response.stocks?.filter((item) => item.type === "fund");
  const bdrsList = response.stocks?.filter((item) => item.type === "bdr");

  return {
    stocksList,
    fundsList,
    bdrsList,
  };
});
