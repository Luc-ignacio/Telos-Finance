<template>
  <div>
    <Button
      icon="pi pi-plus-circle"
      label="Add Holding"
      size="small"
      @click="dialogVisible = true"
    />

    <Dialog
      v-model:visible="dialogVisible"
      modal
      header="Add Holding"
      :style="{ width: '50rem' }"
      :pt="{
        header: {
          class: 'p-5',
        },
        title: {
          class: 'text-lg',
        },
      }"
    >
      <div class="grid grid-cols-2 gap-4">
        <p class="col-span-2">Enter the details of your investment below.</p>

        <BaseInputField label="Country" :isRequired="true">
          <Select
            v-model="form.country"
            :options="countries"
            optionLabel="name"
            class="w-full"
          />
        </BaseInputField>

        <BaseInputField label="Exchange" :isRequired="false">
          <InputText type="text" v-model="form.exchange" fluid />
        </BaseInputField>

        <BaseInputField label="Asset Class" :isRequired="true">
          <Select
            v-model="form.assetClass"
            :options="assetClasses"
            optionLabel="name"
            class="w-full"
          />
        </BaseInputField>

        <BaseInputField label="Asset Type" :isRequired="true">
          <Select
            :disabled="!form.assetClass"
            v-model="form.assetType"
            :options="form.assetClass?.types"
            optionLabel="name"
            optionValue="value"
            class="w-full"
          />
        </BaseInputField>

        <TransactionAddStock
          v-model:selectedAssetType="form.assetType"
          v-model:selectedCurrency="form.country.currency"
          v-model:assetName="form.name"
          v-model:assetTicker="form.ticker"
          v-model:quantity="form.quantity"
          v-model:price="form.price"
          v-model:tradeDate="form.tradeDate"
          v-model:transactionType="form.transactionType"
          class="grid grid-cols-2 gap-4 col-span-2"
        />

        <TransactionAddFixedIncome
          v-model:selectedAssetType="form.assetType"
          v-model:selectedCurrency="form.country.currency"
          v-model:assetName="form.name"
          v-model:assetTicker="form.ticker"
          v-model:price="form.price"
          v-model:tradeDate="form.tradeDate"
          v-model:transactionType="form.transactionType"
          v-model:fixedIncomeIndexer="form.fixedIncomeIndexer"
          v-model:fixedIncomeRate="form.fixedIncomeRate"
          v-model:maturityDate="form.fixedIncomeMaturityDate"
          class="grid grid-cols-2 gap-4 col-span-2"
        />

        <div class="flex justify-end gap-2 mt-4 col-span-2">
          <Button
            type="button"
            label="Cancel"
            severity="secondary"
            outlined
            size="small"
            icon="pi pi-times"
            :disabled="isSaving"
            @click="closeDialog"
          />

          <Button
            type="button"
            label="Save"
            size="small"
            icon="pi pi-check"
            :loading="isSaving"
            @click="saveAsset"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import type { QuoteListResponse } from "brapi/resources/quote.mjs";
import {
  AssetClass,
  CountryCode,
  CurrencyCode,
  TransactionType,
} from "@prisma/client";
import type { HoldingFormInfo } from "~/types";
const { getAllStocks } = useMarkets();
const { addTransaction } = useTransactions();
const toast = useToast();
const emit = defineEmits(["refresh"]);

const props = defineProps({
  walletId: {
    type: String,
    required: true,
  },
});

const loading = ref<boolean>();
const isSaving = ref<boolean>(false);
const dialogVisible = ref<boolean>(false);

const countries = [
  {
    code: "AU",
    currency: "AUD",
    name: "Australia",
  },
  {
    code: "BR",
    currency: "BRL",
    name: "Brazil",
  },
  {
    code: "US",
    currency: "USD",
    name: "United States",
  },
];

const stocksList = ref<QuoteListResponse.Stock[]>();
const fundsList = ref<QuoteListResponse.Stock[]>();

const init = async () => {
  loading.value = true;

  const res = await getAllStocks();
  stocksList.value = res.stocksList;
  fundsList.value = res.fundsList;

  loading.value = false;
};

const assetClasses = [
  {
    name: "Cash",
    value: "CASH",
    types: [
      {
        name: "Cash",
        value: "CASH",
      },
    ],
  },
  {
    name: "Crypto",
    value: "CRYPTO",
    types: [
      {
        name: "Crypto",
        value: "CRYPTO",
      },
    ],
  },
  {
    name: "Equity",
    value: "EQUITY",
    types: [
      {
        name: "Stock",
        value: "STOCK",
      },
    ],
  },
  {
    name: "ETF",
    value: "ETF",
    types: [
      {
        name: "ETF",
        value: "ETF",
      },
    ],
  },
  {
    name: "Fixed Income",
    value: "FIXED_INCOME",
    types: [
      {
        name: "Private Bond",
        value: "BOND",
      },
      {
        name: "Government Bond",
        value: "GOV_BOND",
      },
    ],
  },
  {
    name: "Funds",
    value: "FUNDS",
    types: [
      {
        name: "Fund",
        value: "FUND",
      },
    ],
  },
  {
    name: "Real Estate",
    value: "REAL_ESTATE",
    types: [
      {
        name: "REIT",
        value: "REIT",
      },
    ],
  },
];

const selectedStock = ref<(typeof stocksList.value)[number]>();

watch(selectedStock, (newValue) => {
  form.value.name = newValue?.name;
  form.value.ticker = newValue?.stock;
});

const form = ref<HoldingFormInfo>({
  name: "",
  ticker: undefined,
  assetClass: undefined,
  assetType: undefined,
  country: {
    code: CountryCode.BR,
    currency: CurrencyCode.BRL,
  },
  exchange: undefined,
  quantity: undefined,
  price: undefined,
  fixedIncomeIndexer: undefined,
  fixedIncomeRate: undefined,
  fixedIncomePurchaseDate: undefined,
  fixedIncomeMaturityDate: undefined,
  tradeDate: new Date(),
  transactionType: TransactionType.BUY,
});

watch(
  () => form.value.assetClass,
  (newValue, oldValue) => {
    if (oldValue !== undefined) {
      form.value.assetType = undefined;
    }
  },
);

const closeDialog = () => {
  form.value = {
    name: "",
    ticker: undefined,
    assetClass: undefined,
    assetType: undefined,
    country: {
      code: CountryCode.BR,
      currency: CurrencyCode.BRL,
    },
    exchange: undefined,
    quantity: undefined,
    price: undefined,
    fixedIncomeIndexer: undefined,
    fixedIncomeRate: undefined,
    fixedIncomePurchaseDate: undefined,
    fixedIncomeMaturityDate: undefined,
    tradeDate: new Date(),
    transactionType: TransactionType.BUY,
  };

  dialogVisible.value = false;
};

const saveAsset = async () => {
  isSaving.value = true;

  if (form.value.assetClass?.value === AssetClass.FIXED_INCOME) {
    form.value.quantity = 1;
  }

  if (
    !form.value.country ||
    !form.value.assetClass ||
    !form.value.name ||
    !form.value.tradeDate ||
    !form.value.price ||
    !form.value.quantity
  ) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Please fill all required fields",
      life: 5000,
    });
    isSaving.value = false;
    return;
  }

  const assetData = {
    country: form.value.country.code,
    currency: form.value.country.currency,
    exchange: form.value.exchange,
    assetClass: form.value.assetClass.value,
    assetType: form.value.assetType,
    name: form.value.name.toUpperCase(),
    ticker: form.value.ticker,
    tradeDate: form.value.tradeDate,
    price: form.value.price,
    quantity: form.value.quantity,
    transactionType: form.value.transactionType,
    fixedIncomeIndexer: form.value.fixedIncomeIndexer,
    fixedIncomeRate: form.value.fixedIncomeRate,
    fixedIncomePurchaseDate: form.value.tradeDate,
    fixedIncomeMaturityDate: form.value.fixedIncomeMaturityDate,
  };

  try {
    if (props.walletId) {
      const response = await addTransaction(props.walletId, assetData);

      if (response) {
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Transaction added successfully",
          life: 5000,
        });
      }

      closeDialog();
      emit("refresh");
    }
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.statusMessage || "Failed to add transaction",
      life: 5000,
    });
  } finally {
    isSaving.value = false;
  }
};

onMounted(async () => {
  await init();
});
</script>
