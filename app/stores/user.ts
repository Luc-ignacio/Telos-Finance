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

    const loading = ref<boolean>();

    const SignInWithGoogle = async () => {
      loading.value = true;

      const { url } = await signInUser();
      window.location.href = url;

      loading.value = false;
    };

    const SignOut = async () => {
      loading.value = true;

      await signOutUser();

      navigateTo({ name: "login" });

      loading.value = false;
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
