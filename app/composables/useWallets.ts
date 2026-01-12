export function useWallets() {
  const getWalletsByUserId = async (userId: string) => {
    const wallets = await $fetch(`/api/v1/wallets/user/${userId}`, {
      method: "GET",
    });
    return wallets;
  };

  const getWalletById = async (walletId: string) => {
    const wallet = await $fetch(`/api/v1/wallets/${walletId}`, {
      method: "GET",
    });
    return wallet;
  };

  const getWalletQuotes = async (stocks: string[]) => {
    const quotes = await $fetch(`/api/v1/wallets/get-quotes/${stocks}`, {
      method: "GET",
    });
    return quotes;
  };

  return {
    getWalletsByUserId,
    getWalletById,
    getWalletQuotes,
  };
}
