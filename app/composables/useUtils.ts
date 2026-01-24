import { CurrencyCode, TransactionType } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/library";

export function useUtils() {
  const formatNumber = (number: string) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(Number(number));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const formatPrice = (
    price: Decimal | number | null | undefined,
    currency: CurrencyCode,
  ) => {
    const formattedPrice = Number(price).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    switch (currency) {
      case CurrencyCode.AUD:
        return `A$ ${formattedPrice}`;
      case CurrencyCode.BRL:
        return `R$ ${formattedPrice}`;
      case CurrencyCode.USD:
        return `U$ ${formattedPrice}`;
    }
  };

  const formatTotalReturn = (totalReturn: Decimal | number) => {
    return Math.abs(Number(totalReturn));
  };

  const getClass = (change: number) => {
    if (change < 0) {
      return "text-red-600";
    } else {
      return "text-green-600";
    }
  };

  const getIcon = (change: number) => {
    if (change < 0) {
      return "pi pi-arrow-down-right";
    } else {
      return "pi pi-arrow-up-right";
    }
  };

  const getTransactionClass = (type: TransactionType) => {
    switch (type) {
      case TransactionType.BUY:
        return `text-green-600 bg-green-100`;
      case TransactionType.SELL:
        return `text-red-600 bg-red-100`;
      case TransactionType.DIVIDEND:
        return `text-indigo-600 bg-indigo-100`;
      case TransactionType.INTEREST:
        return `text-cyan-600 bg-cyan-100`;
    }
  };

  const getTransactionTypeIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.BUY:
        return `solar:square-double-alt-arrow-up-linear`;
      case TransactionType.SELL:
        return `solar:square-double-alt-arrow-down-linear`;
      case TransactionType.DIVIDEND:
        return `solar:square-alt-arrow-up-linear`;
      case TransactionType.INTEREST:
        return `solar:square-alt-arrow-up-linear`;
    }
  };

  const getTransactionTypeLabel = (type: TransactionType) => {
    switch (type) {
      case TransactionType.BUY:
        return `Buy`;
      case TransactionType.SELL:
        return `Sell`;
      case TransactionType.DIVIDEND:
        return `Dividend`;
      case TransactionType.INTEREST:
        return `Interest`;
    }
  };

  return {
    formatNumber,
    formatDate,
    formatPrice,
    formatTotalReturn,
    getClass,
    getIcon,
    getTransactionClass,
    getTransactionTypeIcon,
    getTransactionTypeLabel,
  };
}
