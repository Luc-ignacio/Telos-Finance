<template>
  <div class="w-full h-full flex items-center justify-center">
    <ProgressSpinner />
  </div>
</template>

<script lang="ts" setup>
import { userStore } from "~/stores/user";
const UserStore = userStore();
const { currentUser } = storeToRefs(UserStore);

const { createUserAndWallet } = useUsers();

const user = useSupabaseUser();

watch(
  user,
  async () => {
    if (user.value) {
      currentUser.value = {
        id: user.value.sub,
        name: user.value.user_metadata.full_name,
        email: user.value.user_metadata.email,
        avatar: user.value.user_metadata.avatar_url,
      };

      const response = await createUserAndWallet(currentUser.value);

      if (response) {
        return navigateTo("/");
      }
    }
  },
  { immediate: true }
);
</script>
