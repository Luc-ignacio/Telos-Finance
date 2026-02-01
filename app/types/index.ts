import {
  Prisma,
  type Wallet,
  type Holding,
  TransactionType,
  CountryCode,
  CurrencyCode,
  FixedIncomeIndexer,
  AssetType,
} from "@prisma/client";
import type { QuoteRetrieveResponse } from "brapi/resources/quote.mjs";

export type WalletWithHoldings = Prisma.WalletGetPayload<{
  include: { Holdings: true };
}>;

export type TransactionWithHoldings = Prisma.TransactionGetPayload<{
  include: { Holding: true };
}>;

export type FormattedWallet = Wallet & {
  totalInvested: number;
  totalValue: number;
  totalReturn: number;
  totalReturnPercentage: number;
  Holdings: FormattedHolding[];
};

export type FormattedHolding = Holding & {
  quote: QuoteRetrieveResponse.Result | null;
  paidValue: number;
  mktValue?: number;
  grossValue?: number;
  netValue?: number;
  totalReturn?: number;
  totalGrossReturn?: number;
  totalNetReturn?: number;
  totalTax?: number;
  totalReturnPercentage: number;
  fixedIncomeApplications?: Array<{
    date: Date;
    invested: number;
    grossValue: number;
    netValue: number;
    taxRate: number;
    tax: number;
    grossReturn: number;
    netReturn: number;
    returnPercentage: number;
  }>;
};

export enum YieldIntervals {
  YEAR_TO_DATE = "YEAR_TO_DATE",
  TWELVE_MONTHS = "TWELVE_MONTHS",
  LAST_YEAR = "LAST_YEAR",
}

export type AssetTypeOption = {
  name: string;
  value: string;
};

export type AssetClassOption = {
  name: string;
  value: string;
  types: AssetTypeOption[];
};

export type CountryOption = {
  code: CountryCode;
  currency: CurrencyCode;
  name?: string;
};

export type HoldingFormInfo = {
  name: string | undefined;
  ticker: string | undefined;
  assetClass: AssetClassOption | undefined;
  assetType: AssetType | undefined;
  country: CountryOption;
  exchange: string | undefined;
  quantity: number | undefined;
  price: number | undefined;
  fixedIncomeIndexer: FixedIncomeIndexer | undefined;
  fixedIncomeRate: number | undefined;
  fixedIncomePurchaseDate: Date | undefined;
  fixedIncomeMaturityDate: Date | undefined;
  tradeDate: Date | undefined;
  transactionType: TransactionType | undefined;
};
