import prisma from "../../lib/prisma";
import { ResponseStatus } from "../types/api";

export default class UserRepository {
  async createUser(userData: {
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

      return newUser;
    });
  }
}
