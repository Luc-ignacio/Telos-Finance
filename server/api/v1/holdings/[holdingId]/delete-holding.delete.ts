import { ResponseStatus } from "../../../../types/api";
import HoldingRepository from "../../../../repo/holdings";

const holdingRepo = new HoldingRepository();

export default defineEventHandler(async (event) => {
  const holdingId = getRouterParam(event, "holdingId");

  if (!holdingId) {
    throw createError("Holding Id is not defined");
  }

  try {
    const response = await holdingRepo.deleteTransaction(holdingId);

    if (!response) {
      throw createError({
        statusCode: ResponseStatus.INTERNAL_SERVER_ERROR,
        statusMessage: "Failed to delete holding",
      });
    }

    return response;
  } catch (error) {
    throw error;
  }
});
