<template>
  <div class="h-full">
    <div
      class="flex items-center justify-between gap-5 p-5 h-full rounded-2xl bg-white shadow-sm"
    >
      <div class="w-full">
        <div class="flex items-center gap-2">
          <div
            v-for="item in breadcrumbMenu"
            :key="item?.route"
            class="flex items-center gap-1"
          >
            <NuxtLink
              v-if="item?.route"
              :to="item?.route"
              class="text-sm hover:text-orange-500"
            >
              {{ item?.label }}
            </NuxtLink>
            <span v-else class="text-sm cursor-default">{{ item?.label }}</span>
            <Icon
              v-if="item !== breadcrumbMenu[breadcrumbMenu.length - 1]"
              name="solar:alt-arrow-right-linear"
            />
          </div>
        </div>
      </div>
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
const route = useRoute();
const breadcrumbMenu = computed(() => {
  const menu = route.meta.breadcrumbMenu as Array<{
    label: string;
    route: string;
  }>;

  if (route.params.walletId) {
    if (route.params.holdingId) {
      const newMenu = menu.map((item) => {
        if (item.label === "Wallet") {
          return {
            label: "Wallet",
            route: `/wallets/${route.params.walletId}`,
          };
        }

        if (item.label === "Holding") {
          return {
            label: "Holding",
            route: `/wallets/${route.params.walletId}/holdings/${route.params.holdingId}`,
          };
        }

        return item;
      });

      return newMenu;
    }

    const newMenu = menu.map((item) => {
      if (item.label === "Wallet") {
        return {
          label: "Wallet",
          route: `/wallets/${route.params.walletId}`,
        };
      }

      return item;
    });

    return newMenu;
  }

  if (route.params.ticker) {
    const newMenu = menu.map((item) => {
      if (item.label === "Stock") {
        return {
          label: "Stock",
          route: `/markets/stocks/${route.params.ticker}`,
        };
      }

      return item;
    });

    return newMenu;
  }

  return menu;
});

const home = ref({ icon: "pi pi-eye", route: "/" });

const togglePopover = (event) => {
  popoverRef.value.toggle(event);
};
</script>
