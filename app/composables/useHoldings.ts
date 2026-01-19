export function useHoldings() {
  const getHoldingById = async (holdingId: string) => {
    try {
      const holding = await $fetch(`/api/v1/holdings/${holdingId}`, {
        method: "GET",
      });

      return holding;
    } catch (error) {
      throw error;
    }
  };

  const deleteHolding = async (holdingId: string) => {
    try {
      const response = await $fetch(
        `/api/v1/holdings/${holdingId}/delete-holding`,
        {
          method: "DELETE",
        },
      );

      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    getHoldingById,
    deleteHolding,
  };
}
