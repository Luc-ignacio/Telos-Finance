<template>
  <div class="w-full flex flex-col gap-6">
    <Card
      v-if="loading"
      :pt="{
        root: {
          class: 'rounded-2xl bg-white shadow-sm',
        },
        title: {
          class:
            'text-xl font-title text-gray-700 flex items-center justify-between',
        },
        content: {
          class: 'text-gray-700 mt-2',
        },
      }"
    >
      <template #title>
        <Skeleton height="1.5rem" width="8rem" borderRadius="8px"></Skeleton>
        <Skeleton height="2.5rem" width="2.5rem" borderRadius="8px"></Skeleton>
      </template>

      <template #content>
        <Skeleton height="8rem" width="full" borderRadius="8px"></Skeleton>
      </template>
    </Card>

    <div v-else v-for="wallet in wallets" :key="wallet.id">
      <Card
        :pt="{
          root: {
            class: 'rounded-2xl bg-white shadow-sm',
          },
          title: {
            class:
              'text-xl font-title text-gray-700 flex items-center justify-between',
          },
          content: {
            class: 'text-gray-700',
          },
        }"
      >
        <template #title>
          <h1 class="font-bold">{{ wallet.name }}</h1>
          <Button
            icon="pi pi-eye"
            size="small"
            outlined
            fluid
            @click="
              navigateTo({
                name: 'wallets-walletId',
                params: { walletId: wallet.id },
              })
            "
          />
        </template>

        <template #content>
          <div
            v-if="!wallet?.Holdings?.length"
            class="flex flex-col gap-2 w-full"
          >
            <h2 class="font-semibold">Your wallet is empty</h2>
            <p>
              Start building your portfolio by adding your first asset. We'll
              track performance and keep prices updated automatically.
            </p>
          </div>

          <div v-else>
            {{ wallet.Holdings }}
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { WalletWithHoldings } from "~/types";
import { userStore } from "~/stores/user";

const UserStore = userStore();
const { getWalletsByUserId } = useWallets();

const loading = ref<boolean>();
const wallets = ref<WalletWithHoldings[]>();

const init = async () => {
  loading.value = true;
  const res = await getWalletsByUserId(UserStore.currentUser?.id);
  wallets.value = res;
  loading.value = false;
};

onMounted(async () => {
  await init();
});
</script>
