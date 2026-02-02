<template>
  <div class="w-full flex flex-col gap-6">
    <Card
      v-if="loading"
      :pt="{
        root: {
          class: 'rounded-2xl bg-white shadow-sm',
        },
        title: {
          class: 'text-xl  text-gray-700 flex items-center justify-between',
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
            class: 'text-xl  text-gray-700 flex items-center justify-between',
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
            <div class="w-96">
              <Chart
                type="doughnut"
                :data="setChartData(wallet)"
                :options="chartOptions"
              />
            </div>
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

const chartData = ref();
const chartOptions = ref();

const setChartData = (wallet: WalletWithHoldings) => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: wallet.Holdings?.map((item) => item.ticker),
    datasets: [
      {
        label: wallet.name,
        data: wallet.Holdings.map(
          (item) => Number(item.quantity) * Number(item.avgPrice),
        ),
        backgroundColor: [
          documentStyle.getPropertyValue("--p-amber-500"),
          documentStyle.getPropertyValue("--p-lime-500"),
          documentStyle.getPropertyValue("--p-emerald-500"),
          documentStyle.getPropertyValue("--p-cyan-500"),
          documentStyle.getPropertyValue("--p-blue-500"),
          documentStyle.getPropertyValue("--p-violet-500"),
          documentStyle.getPropertyValue("--p-fuchsia-500"),
          documentStyle.getPropertyValue("--p-rose-500"),
          documentStyle.getPropertyValue("--p-slate-500"),
          documentStyle.getPropertyValue("--p-stone-500"),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue("--p-amber-400"),
          documentStyle.getPropertyValue("--p-lime-400"),
          documentStyle.getPropertyValue("--p-emerald-400"),
          documentStyle.getPropertyValue("--p-cyan-400"),
          documentStyle.getPropertyValue("--p-blue-400"),
          documentStyle.getPropertyValue("--p-violet-400"),
          documentStyle.getPropertyValue("--p-fuchsia-400"),
          documentStyle.getPropertyValue("--p-rose-400"),
          documentStyle.getPropertyValue("--p-slate-400"),
          documentStyle.getPropertyValue("--p-stone-400"),
        ],
      },
    ],
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--p-text-color");

  return {
    plugins: {
      legend: {
        labels: {
          cutout: "30%",
          color: textColor,
        },
        position: "right",
      },
    },
  };
};

onMounted(async () => {
  await init();
  chartOptions.value = setChartOptions();
});
</script>
