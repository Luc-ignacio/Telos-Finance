import {
  AssetClass,
  AssetType,
  CountryCode,
  CurrencyCode,
  Transaction,
  TransactionType,
} from "@prisma/client";
import prisma from "../../lib/prisma";
import { ResponseStatus } from "../types/api";

async function recalculateHoldingInfo(tx, walletId: string, holdingId: string) {
  const transactions = await tx.transa;
}

export default class TransactionRepository {
  async recalculateAndUpdateHoldingInfo(
    tx,
    walletId: string,
    holdingId: string,
  ) {
    const transactions = await tx.transaction.findMany({
      where: {
        walletId: walletId,
        holdingId: holdingId,
      },
      include: {
        Holding: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

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
    },
  ) {
    return await prisma.$transaction(async (tx) => {
      const existingHolding = await tx.holding.findFirst({
        where: {
          OR: [
            {
              walletId: walletId,
              ticker: assetData.ticker,
            },
            {
              walletId: walletId,
              name: assetData.name,
            },
          ],
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
        createdAt: "desc",
      },
    });

    return transactions;
  }
}
