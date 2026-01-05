export function useWallets() {
  const getWalletsByUserId = async (userId: string) => {
    const wallets = await $fetch(`/api/v1/wallets/${userId}/get-all-wallets`, {
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

  return {
    getWalletsByUserId,
    getWalletById,
  };
}
