import {
  AssetClass,
  AssetType,
  CountryCode,
  CurrencyCode,
  TransactionType,
} from "@prisma/client";
import prisma from "../../lib/prisma";
import { ResponseStatus } from "../types/api";

export default class TransactionRepository {
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
    }
  ) {
    return prisma.$transaction(async (tx) => {
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

      if (existingHolding === null) {
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

      if (assetData.transactionType === TransactionType.BUY) {
        const newQuantity =
          Number(existingHolding.quantity) + assetData.quantity;

        const newAvgPrice =
          (Number(existingHolding.avgPrice) * Number(existingHolding.quantity) +
            assetData.price * assetData.quantity) /
          newQuantity;

        const updatedHolding = await tx.holding.update({
          where: {
            id: existingHolding.id,
          },
          data: {
            avgPrice: newAvgPrice,
            quantity: newQuantity,
          },
        });

        return updatedHolding;
      }

      if (assetData.transactionType === TransactionType.SELL) {
        const newQuantity =
          Number(existingHolding.quantity) - assetData.quantity;

        const updatedHolding = await tx.holding.update({
          where: {
            id: existingHolding.id,
          },
          data: {
            quantity: newQuantity,
          },
        });

        return updatedHolding;
      }

      if (!transaction) {
        throw {
          statusCode: ResponseStatus.INTERNAL_SERVER_ERROR,
          statusMessage: "Failed to add transaction",
        };
      }

      return transaction;
    });
  }
}
