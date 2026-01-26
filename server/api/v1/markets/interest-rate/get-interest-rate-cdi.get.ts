import { ResponseStatus } from "~~/server/types/api";
import MarketsRepository from "../../../../repo/markets";
import { YieldIntervals } from "~/types";

const marketsRepo = new MarketsRepository();

export default defineEventHandler(async (event) => {
  const { interval } = getQuery(event);

  try {
    const cdi = await marketsRepo.getInterestRateCDI(
      interval as YieldIntervals,
    );

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
