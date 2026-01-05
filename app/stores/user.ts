import { defineStore } from "pinia";
const { signInUser, signOutUser, getUser } = useUsers();

export const userStore = defineStore(
  "userStore",
  () => {
    const currentUser = ref<{
      id: string;
      name: string;
      email: string;
      avatar: string;
    }>();

    const loading = ref<boolean>(false);
    const toast = useToast();

    const SignInWithGoogle = async () => {
      loading.value = true;

      const { url } = await signInUser();
      window.location.href = url;

      loading.value = false;
    };

    const SignOut = async () => {
      loading.value = true;

      try {
        await signOutUser();

        navigateTo({ name: "login" });
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: error || "Failed to sign out",
          life: 5000,
        });
      } finally {
        loading.value = false;
      }
    };

    onMounted(async () => {
      const res = await getUser();
      if (res.data.user) {
        currentUser.value = {
          id: res.data.user.id,
          name: res.data.user.user_metadata.name,
          email: res.data.user.email,
          avatar: res.data.user.user_metadata.avatar_url,
        };
      }
    });

    return { currentUser, loading, SignInWithGoogle, SignOut };
  },
  {
    persist: true,
  }
);
