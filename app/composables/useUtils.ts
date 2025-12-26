export function useUtils() {
  const formatNumber = (number: string) => {
    return new Intl.NumberFormat("en-AU", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(Number(number));
  };

  return {
    formatNumber,
  };
}
