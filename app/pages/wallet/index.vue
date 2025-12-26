<template>
  <div class="w-full flex flex-col gap-6">
    <Card
      v-if="loading"
      :pt="{
        root: {
          class: 'rounded-2xl bg-white shadow-sm',
        },
        caption: {
          class: 'space-y-2',
        },
        title: {
          class: 'flex items-center gap-4 text-gray-700 ',
        },
        subtitle: {
          class:
            'text-base text-justify flex flex-col gap-4 justify-between text-gray-700',
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

      <template #subtitle>
        <div class="flex flex-col gap-4 w-full">
          <Skeleton height="1.5rem" width="6rem"></Skeleton>
          <Skeleton height="8rem" width="full"></Skeleton>
          <Skeleton height="2.5rem" width="8rem"></Skeleton>
        </div>
      </template>

      <template #footer> </template>
    </Card>

    <Card
      v-else
      :pt="{
        root: {
          class: 'rounded-2xl bg-white shadow-sm',
        },
        caption: {
          class: 'space-y-2',
        },
        title: {
          class: 'font-title text-gray-700',
        },
        subtitle: {
          class: 'text-base font-title text-gray-700',
        },
        content: {
          class: 'text-gray-700',
        },
      }"
    >
      <template #title>
        <h1 class="font-semibold">Holdings</h1>
      </template>

      <template #subtitle>
        <div class="flex flex-col gap-2 w-full">
          <h2 class="text-xl font-semibold">No holdings yet</h2>
          <p>
            This wallet doesn't contain any assets. Add your first investment to
            start tracking performance, allocation, and progress towards your
            income goals.
          </p>
          <Button
            icon="pi pi-plus-circle"
            label="Add Asset"
            class="w-fit"
            size="small"
            @click="addAssetDialog.visible = true"
          />
        </div>
      </template>
    </Card>

    <Dialog
      v-model:visible="addAssetDialog.visible"
      modal
      header="Edit Profile"
      :style="{ width: '25rem' }"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8"
        >Update your information.</span
      >
      <div class="flex items-center gap-4 mb-4">
        <label for="username" class="font-semibold w-24">Username</label>
        <InputText id="username" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-8">
        <label for="email" class="font-semibold w-24">Email</label>
        <InputText id="email" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="addAssetDialog.visible = false"
        ></Button>
        <Button
          type="button"
          label="Save"
          @click="addAssetDialog.visible = false"
        ></Button>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import type { QuoteRetrieveResponse } from "brapi/resources/quote.mjs";

const route = useRoute();
const ticker = route.params.ticker?.toString();

const loading = ref<boolean>();
const stockInfo = ref<QuoteRetrieveResponse.Result>();

const { getStockByTicker } = useMarkets();

const addAssetDialog = ref({
  visible: false,
});

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
