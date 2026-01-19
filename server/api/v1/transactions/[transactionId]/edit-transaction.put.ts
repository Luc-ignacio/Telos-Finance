import { ResponseStatus } from "../../../../types/api";
import TransactionRepository from "../../../../repo/transactions";

const transactionRepo = new TransactionRepository();

export default defineEventHandler(async (event) => {
  const transactionId = getRouterParam(event, "transactionId");

  if (!transactionId) {
    throw createError("Transaction Id is not defined");
  }

  const body = await readBody(event);

  const assetData = body.assetData;
  const walletId = body.walletId;

  try {
    const updatedTransaction = await transactionRepo.editTransaction(
      walletId,
      transactionId,
      assetData,
    );

    if (!updatedTransaction) {
      throw createError({
        statusCode: ResponseStatus.INTERNAL_SERVER_ERROR,
        statusMessage: "Failed to update transaction",
      });
    }

    return updatedTransaction;
  } catch (error) {
    throw error;
  }
});
