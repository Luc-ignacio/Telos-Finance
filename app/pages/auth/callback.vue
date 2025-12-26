<template>
  <div class="w-full h-full flex items-center justify-center">
    <ProgressSpinner />
  </div>
</template>

<script lang="ts" setup>
import { userStore } from "~/stores/user";
const UserStore = userStore();
const { currentUser } = storeToRefs(UserStore);

const { createUser } = useUsers();

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

      const response = await createUser(currentUser.value);

      if (response) {
        return navigateTo("/");
      }
    }
  },
  { immediate: true }
);

// onMounted(async () => {
//   await nextTick();

//   const res = await getUser();
//   user.value = res.data.user;

//   if (user.value.user_metadata) {
//     const userData = {
//       name: user.value.user_metadata.full_name,
//       email: user.value.user_metadata.email,
//     };

//     const response = await createUser(userData);

//     if (response) {
//       navigateTo("/");
//     }
//   }
// });
</script>
