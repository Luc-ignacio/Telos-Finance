import prisma from "../../lib/prisma";

export default class HoldingRepository {
  async getHoldingById(holdingId: string) {
    const holding = await prisma.holding.findUnique({
      where: {
        id: holdingId,
      },
    });

    return holding;
  }
}
