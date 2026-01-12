import prisma from "../../lib/prisma";

export default class WalletRepository {
  async getWalletsByUserId(userId: string) {
    const wallets = await prisma.wallet.findMany({
      where: {
        userId: userId,
      },
      include: {
        Holdings: true,
      },
    });

    return wallets;
  }

  async getWalletById(walletId: string) {
    const wallet = await prisma.wallet.findUnique({
      where: {
        id: walletId,
      },
      include: {
        Holdings: true,
      },
    });

    return wallet;
  }
}
