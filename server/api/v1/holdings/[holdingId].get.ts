import HoldingRepository from "../../../repo/holdings";

const holdingRepo = new HoldingRepository();

export default defineEventHandler(async (event) => {
  const holdingId = getRouterParam(event, "holdingId");

  if (!holdingId) {
    throw createError("Holding Id is not defined");
  }

  const holding = await holdingRepo.getHoldingById(holdingId);

  return holding;
});
