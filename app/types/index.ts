import { Prisma } from "@prisma/client";

export type WalletWithHoldings = Prisma.WalletGetPayload<{
  include: { Holdings: true };
}>;
