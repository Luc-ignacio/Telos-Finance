import { Prisma, type Wallet, type Holding } from "@prisma/client";
import type { QuoteRetrieveResponse } from "brapi/resources/quote.mjs";

export type WalletWithHoldings = Prisma.WalletGetPayload<{
  include: { Holdings: true };
}>;

export type FormattedWallet = Wallet & {
  Holdings: (Holding & {
    quote: QuoteRetrieveResponse.Result | null;
    mktValue: number;
    totalReturn: number;
    totalReturnPercentage: number;
  })[];
};
