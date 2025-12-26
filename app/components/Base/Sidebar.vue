<template>
  <div class="flex flex-col gap-5 h-full rounded-2xl bg-white shadow-sm">
    <div
      class="h-24 p-5 flex items-center justify-center border-b border-gray-200"
    >
      <h1 class="font-title text-2xl font-semibold text-orange-500">
        Telos Finance
      </h1>
    </div>

    <div class="flex flex-col gap-1">
      <div v-for="item in menus" :key="item.id">
        <NuxtLink
          :to="{ name: item.routeName }"
          :class="
            route.name === item.routeName ? 'bg-orange-100 text-orange-500' : ''
          "
          class="flex items-center gap-4 px-5 py-3 mr-10 rounded-r-2xl transition-all hover:bg-gray-200 hover:text-black hover:cursor-pointer duration-300"
        >
          <Icon :name="item.icon" size="24" />
          {{ item.name }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const menus = [
  {
    id: "Dashboard",
    name: "Dashboard",
    routeName: "index",
    icon: "solar:screencast-2-linear",
  },
  {
    id: "Markets",
    name: "Markets",
    routeName: "markets",
    icon: "solar:chart-linear",
  },
  {
    id: "Wallet",
    name: "Wallet",
    routeName: "wallet",
    icon: "solar:wallet-linear",
  },
];
</script>
