import { ResponseStatus } from "../../../../types/api";
import WalletRepository from "../../../../repo/wallets";

const walletRepo = new WalletRepository();

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, "userId");

  if (!userId) {
    throw createError("User Id is not defined");
  }

  const wallets = await walletRepo.getWalletsByUserId(userId);

  if (!wallets) {
    throw createError({
      statusCode: ResponseStatus.INTERNAL_SERVER_ERROR,
      statusMessage: "Failed to fetch wallets",
    });
  }

  return wallets;
});
