import TransactionRepository from "../../../../../repo/transactions";

const transactionRepo = new TransactionRepository();

export default defineEventHandler(async (event) => {
  const walletId = getRouterParam(event, "walletId");

  if (!walletId) {
    throw createError("Wallet Id is not defined");
  }

  const holdingId = getRouterParam(event, "holdingId");

  if (!holdingId) {
    throw createError("Holding Id is not defined");
  }

  const transactions = await transactionRepo.getTransactionsById(
    walletId,
    holdingId
  );

  return transactions;
});
