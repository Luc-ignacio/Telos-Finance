export function useUsers() {
  const signInUser = async () => {
    const signInWithGoogle = await $fetch(`/api/v1/users/sign-in`, {
      method: "POST",
    });
    return signInWithGoogle;
  };

  const createUserAndWallet = async (userData: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  }) => {
    const user = await $fetch(`/api/v1/users/create-user`, {
      method: "POST",
      body: { userData },
    });
    return user;
  };

  const getUser = async () => {
    const user = await $fetch(`/api/v1/users/get-user`, {
      method: "GET",
    });
    return user;
  };

  const signOutUser = async () => {
    try {
      const response = await $fetch(`/api/v1/users/sign-out`, {
        method: "GET",
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    signInUser,
    createUserAndWallet,
    getUser,
    signOutUser,
  };
}
