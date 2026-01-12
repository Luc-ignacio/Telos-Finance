<template>
  <div class="h-full">
    <div class="flex gap-5 p-5 h-full rounded-2xl bg-white shadow-sm">
      <div class="w-full flex items-center justify-end gap-4">
        <div
          class="flex items-center gap-4 cursor-pointer"
          @click="togglePopover"
        >
          <div class="flex items-center">
            <Avatar
              :image="UserStore.currentUser?.avatar"
              size="large"
              shape="circle"
            />
          </div>
          <div>
            <p class="text-sm text-gray-500">Welcome,</p>
            <p>{{ UserStore.currentUser?.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <Popover ref="popoverRef">
      <div class="flex flex-col gap-4">
        <Button
          label="Sign Out"
          icon="pi pi-sign-out"
          size="small"
          class="w-fit"
          @click="UserStore.SignOut"
          :loading="UserStore.loading"
        />
      </div>
    </Popover>
  </div>
</template>

<script lang="ts" setup>
import { userStore } from "~/stores/user";

const UserStore = userStore();
const popoverRef = ref();

const togglePopover = (event) => {
  popoverRef.value.toggle(event);
};
</script>
