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
            class="w-full"
          />
        </BaseInputField>

        <BaseInputField label="Asset Name" :isRequired="true">
          <InputText type="text" v-model="form.name" fluid />
        </BaseInputField>

        <BaseInputField label="Asset Ticker" :isRequired="false">
          <InputText type="text" v-model="form.ticker" fluid />
        </BaseInputField>

        <BaseInputField label="Trade Date" :isRequired="true">
          <DatePicker
            v-model="form.tradeDate"
            showIcon
            fluid
            dateFormat="dd MM yy"
            iconDisplay="input"
          />
        </BaseInputField>

        <BaseInputField label="Trade Type" :isRequired="true">
          <Select
            v-model="form.transactionType"
            :options="transactions"
            optionLabel="name"
            optionValue="value"
            class="w-full"
          />
        </BaseInputField>

        <BaseInputField label="Price" :isRequired="true">
          <InputNumber
            v-model="form.price"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            mode="currency"
            :currency="form.country.currency"
            fluid
          />
        </BaseInputField>

        <BaseInputField label="Quantity" :isRequired="true">
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
import type {
  CountryCode,
  CurrencyCode,
  TransactionType,
} from "@prisma/client";

const { addTransaction } = useTransactions();
const toast = useToast();
const emit = defineEmits(["refresh"]);

const props = defineProps({
  walletId: {
    type: String,
    required: true,
  },
});

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
</script>
