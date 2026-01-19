import type {
  AssetClass,
  AssetType,
  CountryCode,
  CurrencyCode,
  TransactionType,
} from "@prisma/client";

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
    },
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

  const editTransaction = async (
    walletId: string,
    transactionId: string,
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
    },
  ) => {
    try {
      const transaction = await $fetch(
        `/api/v1/transactions/${transactionId}/edit-transaction`,
        {
          method: "PUT",
          body: { walletId, assetData },
        },
      );

      return transaction;
    } catch (error) {
      throw error;
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    try {
      const response = await $fetch(
        `/api/v1/transactions/${transactionId}/delete-transaction`,
        {
          method: "DELETE",
        },
      );

      return response;
    } catch (error) {
      throw error;
    }
  };

  const getTransactionsById = async (walletId: string, holdingId: string) => {
    try {
      const transactions = await $fetch(
        `/api/v1/wallets/${walletId}/holdings/${holdingId}`,
        {
          method: "GET",
        },
      );

      return transactions;
    } catch (error) {
      throw error;
    }
  };

  return {
    addTransaction,
    editTransaction,
    deleteTransaction,
    getTransactionsById,
  };
}
