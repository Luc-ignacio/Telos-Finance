import { ResponseStatus } from "../../../types/api";
import TransactionRepository from "../../../repo/transactions";
import { handleError } from "vue";

const transactionRepo = new TransactionRepository();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const assetData = body.assetData;
  const walletId = body.walletId;

  try {
    const transaction = await transactionRepo.addTransaction(
      walletId,
      assetData
    );

    if (!transaction) {
      throw createError({
        statusCode: ResponseStatus.INTERNAL_SERVER_ERROR,
        statusMessage: "Failed to add transaction",
      });
    }

    return transaction;
  } catch (error) {
    throw error;
  }
});
