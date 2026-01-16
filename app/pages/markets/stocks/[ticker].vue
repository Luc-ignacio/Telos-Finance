<template>
  <div class="w-full flex flex-col gap-6">
    <Card
      v-if="loading"
      :pt="{
        root: {
          class: 'rounded-2xl bg-white shadow-sm',
        },
        title: {
          class: 'text-lg flex items-center gap-4 text-gray-700 ',
        },
        content: {
          class: 'text-gray-700 mt-2',
        },
      }"
    >
      <template #title>
        <Skeleton height="4rem" width="4rem" borderRadius="16px"></Skeleton>

        <div class="flex flex-col gap-2">
          <Skeleton height="1.5rem" width="24rem" borderRadius="8px"></Skeleton>
          <Skeleton height="1.5rem" width="18rem" borderRadius="8px"></Skeleton>
        </div>
      </template>

      <template #content>
        <div class="flex flex-col gap-4 w-full">
          <Skeleton height="1.5rem" width="6rem"></Skeleton>
          <Skeleton height="8rem" width="full"></Skeleton>
          <Skeleton height="2.5rem" width="8rem"></Skeleton>
        </div>
      </template>
    </Card>

    <Card
      v-else
      :pt="{
        root: {
          class: 'rounded-2xl bg-white shadow-sm',
        },
        title: {
          class: 'text-xl flex items-center gap-4 text-gray-800 ',
        },
        content: {
          class: 'text-gray-700 mt-2',
        },
      }"
    >
      <template #title>
        <img
          :src="stockInfo?.logourl"
          :alt="stockInfo?.shortName"
          width="64"
          class="rounded-xl"
        />

        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <h1 class="font-bold">
              {{ stockInfo?.symbol }}
            </h1>
            –
            <p>
              {{ stockInfo?.longName }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <h2 class="font-bold">
              R$
              {{ stockInfo?.regularMarketPrice?.toFixed(2).toLocaleString() }}
            </h2>

            <span
              class="flex items-center gap-1 text-base"
              :class="getClass(stockInfo?.regularMarketChange)"
            >
              <i :class="getIcon(stockInfo?.regularMarketChange)" size="24" />
              R$
              {{ stockInfo?.regularMarketChange?.toFixed(2).toLocaleString() }}
              ({{ stockInfo?.regularMarketChangePercent?.toFixed(2) }}%) Day
            </span>
          </div>
        </div>
      </template>

      <template #content>
        <div
          v-if="stockInfo?.summaryProfile"
          class="flex flex-col gap-2 w-full"
        >
          <h2 class="text-lg font-bold">About</h2>
          <p>{{ stockInfo?.summaryProfile?.longBusinessSummary }}</p>

          <NuxtLink :to="stockInfo?.summaryProfile?.website" target="_blank">
            <Button
              icon="pi pi-globe"
              label="Website"
              outlined
              class="w-fit"
              size="small"
            />
          </NuxtLink>
        </div>

        <div v-else class="flex flex-col gap-2 w-full">
          <h2 class="text-xl font-semibold">Company information unavailable</h2>
          <p>
            We couldn't find detailed information for this asset at the moment.
          </p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import type { QuoteRetrieveResponse } from "brapi/resources/quote.mjs";

const route = useRoute();
const ticker = route.params.ticker?.toString();

const loading = ref<boolean>();
const stockInfo = ref<QuoteRetrieveResponse.Result>();

const { getStockByTicker } = useMarkets();
const { formatNumber } = useUtils();

const getClass = (marketChange: number) => {
  if (marketChange < 0) {
    return "text-red-500";
  } else {
    return "text-green-500";
  }
};

const getIcon = (marketChange: number) => {
  if (marketChange < 0) {
    return "pi pi-arrow-down-right";
  } else {
    return "pi pi-arrow-up-right";
  }
};

const init = async () => {
  loading.value = true;
  if (ticker) {
    const res = await getStockByTicker(ticker);
    stockInfo.value = res;
  }
  loading.value = false;
};

onMounted(async () => {
  await init();
});
</script>
