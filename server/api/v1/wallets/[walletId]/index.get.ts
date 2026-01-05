import { ResponseStatus } from "../../../../types/api";
import WalletRepository from "../../../../repo/wallets";

const walletRepo = new WalletRepository();

export default defineEventHandler(async (event) => {
  const walletId = getRouterParam(event, "walletId");

  if (!walletId) {
    throw createError("Wallet Id is not defined");
  }

  const wallet = await walletRepo.getWalletById(walletId);

  if (!wallet) {
    throw createError({
      statusCode: ResponseStatus.INTERNAL_SERVER_ERROR,
      statusMessage: "Failed to fetch wallet",
    });
  }

  return wallet;
});
