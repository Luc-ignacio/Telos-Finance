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
        title: {
          class:
            'text-lg font-title text-gray-700 flex items-center justify-between',
        },
        content: {
          class: 'text-gray-700 mt-2',
        },
      }"
    >
      <template #title>
        <h1 class="font-semibold">{{ wallet?.name }}</h1>
        <Button
          icon="pi pi-plus-circle"
          label="Add Transaction"
          size="small"
          @click="dialogVisible = true"
        />
      </template>

      <template #content>
        <div v-if="!wallet?.Holdings.length" class="flex flex-col gap-2 w-full">
          <h2 class="font-semibold">No holdings yet</h2>
          <p>
            This wallet doesn't contain any assets. Add your first investment to
            start tracking performance, allocation, and progress towards your
            goals.
          </p>
        </div>

        <div v-else class="grid grid-cols-2 gap-4 w-full">
          <div
            v-for="holding in wallet.Holdings"
            :key="holding.id"
            @click="
              navigateTo({
                name: 'wallets-walletId-asset-assetId',
                params: { walletId: wallet.id, assetId: holding.id },
              })
            "
          >
            <Card
              :pt="{
                root: {
                  class:
                    'rounded-2xl bg-gray-100 shadow-sm hover:cursor-pointer hover:shadow-md transition-shadow',
                },
                title: {
                  class:
                    'font-title text-gray-700 flex items-center justify-between',
                },
                content: {
                  class: 'text-base text-gray-700',
                },
              }"
            >
              <template #title>
                <h1 class="text-base font-semibold">
                  {{ holding.ticker }}
                </h1>
                <h2 class="text-sm uppercase">{{ holding.name }}</h2>
              </template>

              <template #content>
                <div class="flex items-center justify-between">
                  <p>Quantity</p>
                  <p class="font-semibold">
                    {{ Number(holding.quantity).toLocaleString("pt-BR") }}
                  </p>
                </div>

                <div class="flex items-center justify-between">
                  <p>Average Price</p>
                  <p class="font-semibold">
                    {{ formatPrice(holding.avgPrice, holding.currency) }}
                  </p>
                </div>

                <div class="flex items-center justify-between">
                  <p>Value</p>
                  <p class="font-semibold">
                    {{
                      calculateTotalValue(
                        holding.avgPrice,
                        holding.quantity,
                        holding.currency
                      )
                    }}
                  </p>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </template>
    </Card>

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

        <div class="flex flex-col gap-1">
          <label class="text-sm">
            Country
            <span class="text-red-500">*</span>
          </label>

          <Select
            v-model="form.country"
            :options="countries"
            optionLabel="name"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm">Exchange</label>
          <InputText type="text" v-model="form.exchange" fluid />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm">
            Asset Class
            <span class="text-red-500">*</span>
          </label>
          <Select
            v-model="form.assetClass"
            :options="assetClasses"
            optionLabel="name"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm">Asset Type</label>
          <Select
            :disabled="!form.assetClass"
            v-model="form.assetType"
            :options="form.assetClass?.types"
            optionLabel="name"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm">
            Asset Name
            <span class="text-red-500">*</span>
          </label>
          <InputText type="text" v-model="form.name" fluid />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm">Asset Ticker</label>
          <InputText type="text" v-model="form.ticker" fluid />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm">
            Trade Date
            <span class="text-red-500">*</span>
          </label>
          <DatePicker
            v-model="form.tradeDate"
            showIcon
            fluid
            dateFormat="dd MM yy"
            iconDisplay="input"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm">
            Trade Type
            <span class="text-red-500">*</span>
          </label>
          <Select
            v-model="form.transactionType"
            :options="transactions"
            optionLabel="name"
            optionValue="value"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm">
            Price
            <span class="text-red-500">*</span>
          </label>
          <InputNumber
            v-model="form.price"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            mode="currency"
            :currency="form.country.currency"
            fluid
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm">
            Quantity
            <span class="text-red-500">*</span>
          </label>
          <InputNumber
            v-model="form.quantity"
            :minFractionDigits="0"
            :maxFractionDigits="8"
            fluid
          />
        </div>

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
import type { WalletWithHoldings } from "~/types";

const route = useRoute();
const walletId = route.params.walletId?.toString();

const wallet = ref<WalletWithHoldings>();
const { getWalletById } = useWallets();
const { addTransaction } = useTransactions();
const { formatPrice, calculateTotalValue } = useUtils();
const toast = useToast();

const loading = ref<boolean>(false);
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

const init = async () => {
  loading.value = true;
  if (walletId) {
    const res = await getWalletById(walletId);
    wallet.value = res;
  }
  loading.value = false;
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
    if (walletId) {
      const response = await addTransaction(walletId, assetData);

      if (response) {
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Transaction added successfully",
          life: 5000,
        });
      }

      closeDialog();
      await init();
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
