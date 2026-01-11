import { CurrencyCode } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/library";

export function useUtils() {
  const formatNumber = (number: string) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(Number(number));
  };

  const formatPrice = (
    price: Decimal | number | null | undefined,
    currency: CurrencyCode
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
      return "text-red-500";
    } else {
      return "text-green-500";
    }
  };

  const getIcon = (change: number) => {
    if (change < 0) {
      return "pi pi-arrow-down-right";
    } else {
      return "pi pi-arrow-up-right";
    }
  };

  return {
    formatNumber,
    formatPrice,
    formatTotalReturn,
    getClass,
    getIcon,
  };
}
