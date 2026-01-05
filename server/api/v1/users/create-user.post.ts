import { ResponseStatus } from "../../../types/api";
import UserRepository from "../../../repo/users";

const userRepo = new UserRepository();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const userData = body.userData;

  const user = await userRepo.createUserAndWallet(userData);

  if (!user) {
    throw createError({
      statusCode: ResponseStatus.INTERNAL_SERVER_ERROR,
      statusMessage: "Failed to create user",
    });
  }

  return user;
});
