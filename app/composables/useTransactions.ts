import type {
  AssetClass,
  AssetType,
  CountryCode,
  CurrencyCode,
  TransactionType,
} from "@prisma/client";
import { ResponseStatus } from "~~/server/types/api";

export function useTransactions() {
  const addTransaction = async (
    walletId: string,
    assetData: {
      country: CountryCode;
      currency: CurrencyCode;
      exchange: string | undefined;
      assetClass: AssetClass;
      assetType: AssetType | undefined;
      name: string;
      ticker: string | undefined;
      tradeDate: Date;
      price: number;
      quantity: number;
      transactionType: TransactionType;
    }
  ) => {
    try {
      const transaction = await $fetch(`/api/v1/transactions/add-transaction`, {
        method: "POST",
        body: { walletId, assetData },
      });

      return transaction;
    } catch (error) {
      throw error;
    }
  };

  return {
    addTransaction,
  };
}
