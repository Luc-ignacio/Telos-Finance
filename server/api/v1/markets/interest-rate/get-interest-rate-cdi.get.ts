import { ResponseStatus } from "~~/server/types/api";
import MarketsRepository from "../../../../repo/markets";

const marketsRepo = new MarketsRepository();

export default defineEventHandler(async (event) => {
  try {
    const cdi = await marketsRepo.getInterestRateCDI();

    if (!cdi) {
      throw createError({
        statusCode: ResponseStatus.INTERNAL_SERVER_ERROR,
        statusMessage: "Failed to fetch interest rate CDI",
      });
    }

    return cdi;
  } catch (error) {
    throw error;
  }
});
