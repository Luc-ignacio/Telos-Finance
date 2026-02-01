<template>
  <div
    v-if="
      selectedAssetType === AssetType.STOCK ||
      selectedAssetType === AssetType.REIT
    "
  >
    <BaseInputField
      v-if="selectedAssetType === AssetType.STOCK"
      label="Stock"
      :isRequired="true"
      class="col-span-2"
    >
      <Select
        v-model="selectedStock"
        :options="stocksList"
        showClear
        filter
        :filterFields="['stock', 'name']"
        overlayClass="w-40"
        filterPlaceholder="Search stocks"
        emptyFilterMessage="No stocks that matches your search"
        fluid
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex gap-2">
            <span class="font-bold">{{ slotProps.value?.stock }}</span> -
            {{ slotProps.value?.name }}
          </div>
        </template>

        <template #option="slotProps">
          <div class="flex gap-2 items-center">
            <span class="font-bold text-sm">{{ slotProps.option.stock }}</span
            >-
            <span class="text-sm">{{ slotProps.option.name }}</span>
          </div>
        </template>
      </Select>
    </BaseInputField>

    <BaseInputField
      v-if="selectedAssetType === AssetType.REIT"
      label="REIT"
      :isRequired="true"
      class="col-span-2"
    >
      <Select
        v-model="selectedStock"
        :options="fundsList"
        showClear
        filter
        :filterFields="['stock', 'name']"
        overlayClass="w-40"
        filterPlaceholder="Search REITs"
        emptyFilterMessage="No REITs that matches your search"
        fluid
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex gap-2">
            <span class="font-bold">{{ slotProps.value?.stock }}</span> -
            {{ slotProps.value?.name }}
          </div>
        </template>

        <template #option="slotProps">
          <div class="flex gap-2 items-center">
            <span class="font-bold text-sm">{{ slotProps.option.stock }}</span
            >-
            <span class="text-sm">{{ slotProps.option.name }}</span>
          </div>
        </template>
      </Select>
    </BaseInputField>

    <div v-if="selectedStock" class="grid grid-cols-2 gap-4 col-span-2">
      <BaseInputField label="Asset Name" :isRequired="true">
        <InputText type="text" v-model="assetName" fluid disabled />
      </BaseInputField>

      <BaseInputField label="Asset Ticker" :isRequired="false">
        <InputText type="text" v-model="assetTicker" fluid disabled />
      </BaseInputField>

      <BaseInputField label="Trade Date" :isRequired="true">
        <DatePicker
          v-model="tradeDate"
          showIcon
          showButtonBar
          fluid
          dateFormat="dd MM yy"
          iconDisplay="input"
        />
      </BaseInputField>

      <BaseInputField label="Trade Type" :isRequired="true">
        <Select
          v-model="transactionType"
          :options="transactions"
          optionLabel="name"
          optionValue="value"
          class="w-full"
        />
      </BaseInputField>

      <BaseInputField label="Quantity" :isRequired="true">
        <InputNumber
          v-model="quantity"
          :minFractionDigits="0"
          :maxFractionDigits="8"
          fluid
        />
      </BaseInputField>

      <BaseInputField label="Price" :isRequired="true">
        <InputNumber
          v-model="price"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          mode="currency"
          :currency="selectedCurrency"
          fluid
        />
      </BaseInputField>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { QuoteListResponse } from "brapi/resources/quote.mjs";
import { AssetType, CurrencyCode, TransactionType } from "@prisma/client";

const { getAllStocks } = useMarkets();

const selectedAssetType = defineModel<AssetType | undefined>(
  "selectedAssetType",
  { required: true },
);

const selectedCurrency = defineModel<CurrencyCode | undefined>(
  "selectedCurrency",
  { required: true },
);

const assetName = defineModel<string | undefined>("assetName", {
  required: true,
});

const assetTicker = defineModel<string | undefined>("assetTicker", {
  required: true,
});

const quantity = defineModel<number | undefined>("quantity", {
  required: true,
});

const price = defineModel<number | undefined>("price", {
  required: true,
});

const tradeDate = defineModel<Date | undefined>("tradeDate", {
  required: true,
});

const transactionType = defineModel<TransactionType | undefined>(
  "transactionType",
  { required: true },
);

const loading = ref<boolean>();

const stocksList = ref<QuoteListResponse.Stock[]>();
const fundsList = ref<QuoteListResponse.Stock[]>();

const init = async () => {
  loading.value = true;

  const res = await getAllStocks();
  stocksList.value = res.stocksList;
  fundsList.value = res.fundsList;

  loading.value = false;
};

const transactions = [
  { name: "Buy", value: "BUY" },
  { name: "Sell", value: "SELL" },
  { name: "Dividend", value: "DIVIDEND" },
  { name: "Interest", value: "INTEREST" },
];

const selectedStock = ref<(typeof stocksList.value)[number]>();

watch(selectedStock, () => {
  assetName.value = selectedStock.value.name;
  assetTicker.value = selectedStock.value.stock;
});

onMounted(async () => {
  await init();
});
</script>
