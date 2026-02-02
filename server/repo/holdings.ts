import prisma from "../../lib/prisma";
import { ResponseStatus } from "../types/api";

export default class HoldingRepository {
  async getHoldingById(holdingId: string) {
    const holding = await prisma.holding.findUnique({
      where: {
        id: holdingId,
      },
      include: {
        Transactions: true,
      },
    });

    return holding;
  }

  async deleteTransaction(holdingId: string) {
    const deletedHolding = await prisma.holding.delete({
      where: {
        id: holdingId,
      },
    });

    if (!deletedHolding) {
      throw {
        statusCode: ResponseStatus.INTERNAL_SERVER_ERROR,
        statusMessage: "Failed to delete holding",
      };
    }

    return deletedHolding;
  }
}
