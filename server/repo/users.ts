import prisma from "../../lib/prisma";

export default class UserRepository {
  async createUserAndWallet(userData: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  }) {
    return prisma.$transaction(async (tx) => {
      if (userData.email) {
        const existingUser = await tx.user.findUnique({
          where: {
            email: userData.email,
          },
        });

        if (existingUser) {
          return existingUser;
        }
      }

      const newUser = await tx.user.create({
        data: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
        },
      });

      const newWallet = await tx.wallet.create({
        data: {
          name: "My Wallet",
          userId: newUser.id,
        },
      });

      return newUser;
    });
  }
}
