import { ResponseStatus } from "../../../types/api";
import UsersRepository from "../../../repo/users";

const userRepo = new UsersRepository();

export default eventHandler(async (event) => {
  const body = await readBody(event);

  const userData = body.userData;

  const user = await userRepo.createUser(userData);

  if (!user) {
    throw createError({
      statusCode: ResponseStatus.INTERNAL_SERVER_ERROR,
      statusMessage: "Failed to create user",
    });
  }

  return user;
});
