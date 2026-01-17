<template>
  <div>
    <Button
      icon="pi pi-plus-circle"
      label="Add Transaction"
      size="small"
      @click="dialogVisible = true"
    />

    <Dialog
      v-model:visible="dialogVisible"
      modal
      header="Add Transaction"
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
        <p class="col-span-2">Enter the details of your transaction below.</p>

        <BaseInputField label="Stock" :isRequired="true" class="col-span-2">
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
                <span class="font-bold text-sm">{{
                  slotProps.option.stock
                }}</span
                >-
                <span class="text-sm">{{ slotProps.option.name }}</span>
              </div>
            </template>
          </Select>
        </BaseInputField>

        <BaseInputField v-if="selectedStock" label="Country" :isRequired="true">
          <Select
            v-model="form.country"
            :options="countries"
            optionLabel="name"
            class="w-full"
          />
        </BaseInputField>

        <BaseInputField
          v-if="selectedStock"
          label="Exchange"
          :isRequired="false"
        >
          <InputText type="text" v-model="form.exchange" fluid />
        </BaseInputField>

        <BaseInputField
          v-if="selectedStock"
          label="Asset Class"
          :isRequired="true"
        >
          <Select
            v-model="form.assetClass"
            :options="assetClasses"
            optionLabel="name"
            class="w-full"
          />
        </BaseInputField>

        <BaseInputField
          v-if="selectedStock"
          label="Asset Type"
          :isRequired="true"
        >
          <Select
            :disabled="!form.assetClass"
            v-model="form.assetType"
            :options="form.assetClass?.types"
            optionLabel="name"
            class="w-full"
          />
        </BaseInputField>

        <BaseInputField
          v-if="selectedStock"
          label="Asset Name"
          :isRequired="true"
        >
          <InputText type="text" v-model="form.name" fluid disabled />
        </BaseInputField>

        <BaseInputField
          v-if="selectedStock"
          label="Asset Ticker"
          :isRequired="false"
        >
          <InputText type="text" v-model="form.ticker" fluid disabled />
        </BaseInputField>

        <BaseInputField
          v-if="selectedStock"
          label="Trade Date"
          :isRequired="true"
        >
          <DatePicker
            v-model="form.tradeDate"
            showIcon
            fluid
            dateFormat="dd MM yy"
            iconDisplay="input"
          />
        </BaseInputField>

        <BaseInputField
          v-if="selectedStock"
          label="Trade Type"
          :isRequired="true"
        >
          <Select
            v-model="form.transactionType"
            :options="transactions"
            optionLabel="name"
            optionValue="value"
            class="w-full"
          />
        </BaseInputField>

        <BaseInputField v-if="selectedStock" label="Price" :isRequired="true">
          <InputNumber
            v-model="form.price"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            mode="currency"
            :currency="form.country.currency"
            fluid
          />
        </BaseInputField>

        <BaseInputField
          v-if="selectedStock"
          label="Quantity"
          :isRequired="true"
        >
          <InputNumber
            v-model="form.quantity"
            :minFractionDigits="0"
            :maxFractionDigits="8"
            fluid
          />
        </BaseInputField>

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
          >
          </Button>
          <Button
            type="button"
            label="Save"
            size="small"
            icon="pi pi-check"
            :loading="isSaving"
            @click="saveAsset"
          >
          </Button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import type { QuoteListResponse } from "brapi/resources/quote.mjs";
import type {
  CountryCode,
  CurrencyCode,
  TransactionType,
} from "@prisma/client";

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
        name: "Bond",
        value: "BOND",
      },
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
        name: "Funds",
        value: "FUND",
      },
    ],
  },
  {
    name: "Real Estate",
    value: "REAL_ESTATE",
    types: [
      {
        name: "Real Estate",
        value: "REIT",
      },
    ],
  },
];

const transactions = [
  { name: "Buy", value: "BUY" },
  { name: "Sell", value: "SELL" },
  { name: "Dividend", value: "DIVIDEND" },
  { name: "Interest", value: "INTEREST" },
];

const selectedStock = ref<(typeof stocksList.value)[number]>();

watch(selectedStock, (newValue) => {
  form.value.name = newValue?.name;
  form.value.ticker = newValue?.stock;
});

const form = ref({
  country: {
    code: "BR" as CountryCode,
    currency: "BRL" as CurrencyCode,
  },
  exchange: undefined,
  assetClass: undefined,
  assetType: undefined,
  name: "",
  ticker: undefined,
  tradeDate: new Date(),
  price: undefined,
  quantity: undefined,
  transactionType: "BUY" as TransactionType,
});

const closeDialog = () => {
  form.value = {
    country: {
      code: "BR" as CountryCode,
      currency: "BRL" as CurrencyCode,
    },
    exchange: undefined,
    assetClass: undefined,
    assetType: undefined,
    name: "",
    ticker: undefined,
    tradeDate: new Date(),
    price: undefined,
    quantity: undefined,
    transactionType: "BUY" as TransactionType,
  };

  dialogVisible.value = false;
};

const saveAsset = async () => {
  isSaving.value = true;

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
    assetType: form.value.assetType?.value,
    name: form.value.name.toUpperCase(),
    ticker: form.value.ticker,
    tradeDate: form.value.tradeDate,
    price: form.value.price,
    quantity: form.value.quantity,
    transactionType: form.value.transactionType,
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
