import { CurrencyCode } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/library";

export function useUtils() {
  const formatNumber = (number: string) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(Number(number));
  };

  const formatPrice = (price: Decimal, currency: CurrencyCode) => {
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

  const calculateTotalValue = (
    price: Decimal,
    quantity: Decimal,
    currency: CurrencyCode
  ) => {
    const value = (Number(price) * Number(quantity)).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    switch (currency) {
      case CurrencyCode.AUD:
        return `A$ ${value}`;
      case CurrencyCode.BRL:
        return `R$ ${value}`;
      case CurrencyCode.USD:
        return `U$ ${value}`;
    }
  };

  return {
    formatNumber,
    formatPrice,
    calculateTotalValue,
  };
}
