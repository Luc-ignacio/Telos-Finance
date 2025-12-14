import { serverSupabaseClient } from "#supabase/server";
import prisma from "../../lib/prisma";

export default class UserRepository {
  async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) {
    return prisma;
  }
}
