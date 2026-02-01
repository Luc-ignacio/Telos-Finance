<template>
  <div
    v-if="
      selectedAssetType === AssetType.BOND ||
      selectedAssetType === AssetType.GOV_BOND
    "
  >
    <BaseInputField label="Asset Name" :isRequired="true">
      <InputText type="text" v-model="assetName" fluid />
    </BaseInputField>

    <BaseInputField label="Asset Ticker" :isRequired="false">
      <InputText type="text" v-model="assetTicker" fluid />
    </BaseInputField>

    <BaseInputField label="Indexer" :isRequired="true">
      <Select
        v-model="fixedIncomeIndexer"
        :options="indexers"
        optionLabel="name"
        optionValue="value"
        class="w-full"
      />
    </BaseInputField>

    <BaseInputField label="Rate" :isRequired="true">
      <InputNumber
        v-model="fixedIncomeRate"
        :minFractionDigits="2"
        :maxFractionDigits="2"
        suffix="%"
        fluid
      />
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

    <BaseInputField label="Maturity Date" :isRequired="false">
      <DatePicker
        v-model="maturityDate"
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

    <BaseInputField label="Value" :isRequired="true">
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
</template>

<script lang="ts" setup>
import {
  AssetType,
  CurrencyCode,
  FixedIncomeIndexer,
  TransactionType,
} from "@prisma/client";

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

const fixedIncomeIndexer = defineModel<FixedIncomeIndexer | undefined>(
  "fixedIncomeIndexer",
  { required: true },
);

const fixedIncomeRate = defineModel<number | undefined>("fixedIncomeRate", {
  required: true,
});

const tradeDate = defineModel<Date | undefined>("tradeDate", {
  required: true,
});

const maturityDate = defineModel<Date | undefined>("maturityDate", {
  required: true,
});

const transactionType = defineModel<TransactionType | undefined>(
  "transactionType",
  { required: true },
);

const price = defineModel<number | undefined>("price", {
  required: true,
});

const transactions = [
  { name: "Buy", value: "BUY" },
  { name: "Sell", value: "SELL" },
  { name: "Dividend", value: "DIVIDEND" },
  { name: "Interest", value: "INTEREST" },
];

const indexers = [
  { name: "CDI", value: "CDI" },
  { name: "SELIC", value: "SELIC" },
  { name: "IPCA", value: "IPCA" },
  { name: "Fixed Rate", value: "FIXED_RATE" },
];
</script>
