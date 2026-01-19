import { ResponseStatus } from "../../../../types/api";
import TransactionRepository from "../../../../repo/transactions";

const transactionRepo = new TransactionRepository();

export default defineEventHandler(async (event) => {
  const transactionId = getRouterParam(event, "transactionId");

  if (!transactionId) {
    throw createError("Transaction Id is not defined");
  }

  try {
    const response = await transactionRepo.deleteTransaction(transactionId);

    if (!response) {
      throw createError({
        statusCode: ResponseStatus.INTERNAL_SERVER_ERROR,
        statusMessage: "Failed to delete transaction",
      });
    }

    return response;
  } catch (error) {
    throw error;
  }
});
