import {
  AssetClass,
  AssetType,
  CountryCode,
  CurrencyCode,
  FixedIncomeIndexer,
  Transaction,
  TransactionType,
} from "@prisma/client";
import prisma from "../../lib/prisma";
import { ResponseStatus } from "../types/api";

export default class TransactionRepository {
  async recalculateAndUpdateHoldingInfo(
    tx,
    walletId: string,
    holdingId: string,
  ) {
    const holding = await tx.holding.findUnique({
      where: {
        id: holdingId,
      },
    });

    if (!holding) {
      throw {
        statusCode: ResponseStatus.NOT_FOUND,
        statusMessage: "Holding not found",
      };
    }

    const transactions = await tx.transaction.findMany({
      where: {
        walletId: walletId,
        holdingId: holdingId,
      },
      include: {
        Holding: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // If FIXED_INCOME, get total value
    if (holding.class === AssetClass.FIXED_INCOME) {
      const totalInvested = transactions
        .filter(
          (transaction: Transaction) =>
            transaction.type === TransactionType.BUY,
        )
        .reduce(
          (sum: number, transaction: Transaction) =>
            sum + Number(transaction.price),
          0,
        );

      const totalRedeemed = transactions
        .filter(
          (transaction: Transaction) =>
            transaction.type === TransactionType.REDEMPTION ||
            transaction.type === TransactionType.MATURITY,
        )
        .reduce(
          (sum: number, transaction: Transaction) =>
            sum + Number(transaction.price),
          0,
        );

      await tx.holding.update({
        where: { id: holdingId },
        data: {
          avgPrice: totalInvested - totalRedeemed,
        },
      });

      return;
    }

    let quantity = 0;
    let avgPrice = 0;

    for (const transaction of transactions) {
      if (transaction.type === "BUY") {
        const totalCost =
          avgPrice * quantity +
          Number(transaction.price) * Number(transaction.quantity);

        quantity += Number(transaction.quantity);
        avgPrice = quantity > 0 ? totalCost / quantity : 0;
      }

      if (transaction.type === "SELL") {
        quantity -= Number(transaction.quantity);
      }
    }

    const updatedHolding = await tx.holding.update({
      where: {
        id: holdingId,
      },
      data: {
        quantity: quantity,
        avgPrice: avgPrice,
      },
    });

    if (!updatedHolding) {
      throw {
        statusCode: ResponseStatus.INTERNAL_SERVER_ERROR,
        statusMessage: "Failed to recalculate and update holding",
      };
    }
  }

  async addTransaction(
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
      fixedIncomeIndexer: FixedIncomeIndexer | undefined;
      fixedIncomeRate: number | undefined;
      fixedIncomePurchaseDate: Date | undefined;
      fixedIncomeMaturityDate: Date | undefined;
    },
  ) {
    return await prisma.$transaction(async (tx) => {
      const existingHolding = await tx.holding.findFirst({
        where: {
          walletId: walletId,
          ticker: assetData.ticker,
        },
      });

      if (!existingHolding) {
        const holding = await tx.holding.create({
          data: {
            walletId: walletId,
            country: assetData.country,
            currency: assetData.currency,
            exchange: assetData.exchange,
            class: assetData.assetClass,
            type: assetData.assetType,
            name: assetData.name,
            ticker: assetData.ticker,
            avgPrice: assetData.price,
            quantity: assetData.quantity,
            fixedIncomeIndexer: assetData.fixedIncomeIndexer,
            fixedIncomeRate: assetData.fixedIncomeRate,
            fixedIncomePurchaseDate: assetData.fixedIncomePurchaseDate,
            fixedIncomeMaturityDate: assetData.fixedIncomeMaturityDate,
          },
        });

        const transaction = await tx.transaction.create({
          data: {
            walletId: walletId,
            holdingId: holding.id,
            type: assetData.transactionType,
            quantity: assetData.quantity,
            price: assetData.price,
            currency: assetData.currency,
            tradeDate: assetData.tradeDate,
          },
        });

        return transaction;
      }

      const transaction = await tx.transaction.create({
        data: {
          walletId: walletId,
          holdingId: existingHolding.id,
          type: assetData.transactionType,
          quantity: assetData.quantity,
          price: assetData.price,
          currency: assetData.currency,
          tradeDate: assetData.tradeDate,
        },
      });

      await this.recalculateAndUpdateHoldingInfo(
        tx,
        walletId,
        existingHolding.id,
      );

      if (!transaction) {
        throw {
          statusCode: ResponseStatus.INTERNAL_SERVER_ERROR,
          statusMessage: "Failed to add transaction",
        };
      }

      return transaction;
    });
  }

  async editTransaction(
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
  ) {
    return await prisma.$transaction(async (tx) => {
      const existingHolding = await tx.holding.findFirst({
        where: {
          walletId: walletId,
          ticker: assetData.ticker,
        },
      });

      if (!existingHolding) {
        throw {
          statusCode: ResponseStatus.NOT_FOUND,
          statusMessage: "Holding not found",
        };
      }

      const updatedTransaction = await tx.transaction.update({
        where: {
          id: transactionId,
          walletId: walletId,
        },
        data: {
          walletId: walletId,
          holdingId: existingHolding.id,
          type: assetData.transactionType,
          quantity: assetData.quantity,
          price: assetData.price,
          currency: assetData.currency,
          tradeDate: assetData.tradeDate,
        },
      });

      await this.recalculateAndUpdateHoldingInfo(
        tx,
        walletId,
        existingHolding.id,
      );

      if (!updatedTransaction) {
        throw {
          statusCode: ResponseStatus.INTERNAL_SERVER_ERROR,
          statusMessage: "Failed to update transaction",
        };
      }

      return updatedTransaction;
    });
  }

  async deleteTransaction(transactionId: string) {
    return await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findUnique({
        where: {
          id: transactionId,
        },
      });

      if (!transaction) {
        throw {
          statusCode: ResponseStatus.NOT_FOUND,
          statusMessage: "Transaction not found",
        };
      }

      const holding = await tx.holding.findUnique({
        where: {
          walletId: transaction.walletId,
          id: transaction.holdingId,
        },
      });

      if (!holding) {
        throw {
          statusCode: ResponseStatus.NOT_FOUND,
          statusMessage: "Holding not found",
        };
      }

      const deletedTransaction = await tx.transaction.delete({
        where: {
          id: transaction.id,
        },
      });

      await this.recalculateAndUpdateHoldingInfo(
        tx,
        holding.walletId,
        holding.id,
      );

      if (!deletedTransaction) {
        throw {
          statusCode: ResponseStatus.INTERNAL_SERVER_ERROR,
          statusMessage: "Failed to delete transaction",
        };
      }

      return deletedTransaction;
    });
  }

  async getTransactionsById(walletId: string, holdingId: string) {
    const transactions = await prisma.transaction.findMany({
      where: {
        walletId: walletId,
        holdingId: holdingId,
      },
      include: {
        Holding: true,
      },
      orderBy: {
        tradeDate: "desc",
      },
    });

    return transactions;
  }
}
