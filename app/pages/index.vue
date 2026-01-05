<template>
  <div class="flex w-full gap-5 p-5 rounded-2xl bg-white shadow-sm">
    <h1>Dashboard</h1>
  </div>
</template>

<script lang="ts" setup>
import { userStore } from "~/stores/user";

const UserStore = userStore();
</script>
