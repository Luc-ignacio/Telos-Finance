<template>
  <div
    class="bg-[url(~/assets/images/b3-sign.png)] bg-neutral-900 bg-cover bg-right bg-no-repeat flex w-screen h-screen"
  >
    <div class="w-[50%] h-screen flex items-center justify-center">
      <div
        class="bg-white/80 w-[30rem] rounded-2xl px-10 py-14 flex flex-col items-center justify-center gap-5"
      >
        <h1 class="text-2xl text-center font-semibold">
          Welcome to Telos Finance
        </h1>
        <p class="text-center">
          Manage your investments and keep track of your expenses all in one
          place.
        </p>

        <Button
          @click="UserStore.SignInWithGoogle"
          icon="pi pi-google"
          :loading="UserStore.loading"
          label="Sign In With Google"
          class="mt-5"
          fluid
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: false,
});

import { userStore } from "~/stores/user";

const UserStore = userStore();
</script>
