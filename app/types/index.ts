import { Prisma, type Wallet, type Holding } from "@prisma/client";
import type { QuoteRetrieveResponse } from "brapi/resources/quote.mjs";

export type WalletWithHoldings = Prisma.WalletGetPayload<{
  include: { Holdings: true };
}>;

export type FormattedWallet = Wallet & {
  totalInvested: number;
  totalValue: number;
  totalReturn: number;
  totalReturnPercentage: number;
  Holdings: (Holding & {
    quote: QuoteRetrieveResponse.Result | null;
    paidValue: number;
    mktValue: number;
    totalReturn: number;
    totalReturnPercentage: number;
  })[];
};
