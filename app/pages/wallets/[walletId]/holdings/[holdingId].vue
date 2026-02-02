<template>
  <div class="w-full flex flex-col gap-6">
    <Card
      v-if="loading"
      :pt="{
        root: {
          class: 'rounded-2xl bg-white shadow-sm',
        },
        title: {
          class: 'text-lg  text-gray-700 flex items-center justify-between',
        },
        content: {
          class: 'text-gray-700 mt-2',
        },
      }"
    >
      <template #title>
        <Skeleton height="1.5rem" width="10rem" borderRadius="8px"></Skeleton>
        <Skeleton height="2.5rem" width="10rem" borderRadius="16px"></Skeleton>
      </template>

      <template #content>
        <div class="grid grid-cols-2 gap-4 w-full">
          <Skeleton height="12rem" width="full"></Skeleton>
          <Skeleton height="12rem" width="full"></Skeleton>
          <Skeleton height="12rem" width="full"></Skeleton>
          <Skeleton height="12rem" width="full"></Skeleton>
        </div>
      </template>
    </Card>

    <Card
      v-else
      :pt="{
        root: {
          class: 'rounded-2xl bg-white shadow-sm min-h-[50dvh]',
        },
        title: {
          class: 'text-xl  text-gray-700 flex items-center justify-between',
        },
        content: {
          class: 'text-gray-700 flex gap-4 overflow-y-auto mt-2',
        },
      }"
    >
      <template #title>
        <h1 class="font-bold">{{ holding?.name }}</h1>
        <TransactionAdd :walletId="walletId" @refresh="init()" />
      </template>

      <template #content>
        <div class="w-[50%] flex flex-col gap-4">
          <Card
            v-if="
              holding &&
              (holding.class === AssetClass.EQUITY ||
                holding.class === AssetClass.REAL_ESTATE)
            "
            :pt="{
              root: {
                class: 'rounded-2xl bg-gray-100 shadow-sm',
              },
              title: {
                class: ' text-gray-700',
              },
              content: {
                class: 'text-base text-gray-700 mt-2',
              },
            }"
          >
            <template #title>
              <div class="flex items-center gap-4">
                <img
                  v-if="holding?.quote?.logourl"
                  :src="holding?.quote?.logourl"
                  :alt="holding?.quote?.longName || 'Company logo'"
                  class="rounded-lg w-10"
                />
                <img
                  v-else
                  src="assets/images/telos-finance-logo.png"
                  alt="Telos Finance Logo"
                  class="rounded-lg w-10"
                />

                <div class="flex flex-col">
                  <h1 class="text-base font-semibold">
                    {{ holding.ticker }}
                  </h1>
                  <h2 class="text-xs uppercase">{{ holding.name }}</h2>
                </div>
              </div>
            </template>

            <template #content>
              <div class="flex items-center justify-between">
                <p>Quantity</p>
                <p class="font-semibold">
                  {{ Number(holding.quantity).toLocaleString("pt-BR") }}
                </p>
              </div>

              <div class="flex items-center justify-between">
                <p>Avg Price</p>
                <p class="font-semibold">
                  {{ formatPrice(holding.avgPrice, holding.currency) }}
                </p>
              </div>

              <div class="flex items-center justify-between">
                <p>Mkt Price</p>
                <p class="font-semibold">
                  {{
                    formatPrice(
                      holding.quote?.regularMarketPrice,
                      holding.currency,
                    )
                  }}
                </p>
              </div>

              <div class="flex items-center justify-between">
                <p>Mkt Value</p>
                <p class="font-semibold">
                  {{ formatPrice(holding.mktValue, holding.currency) }}
                </p>
              </div>

              <div class="flex items-center justify-between">
                <p>Return</p>
                <p class="font-semibold" :class="getClass(holding.totalReturn)">
                  <i :class="getIcon(holding.totalReturn)" />
                  {{
                    formatPrice(
                      formatTotalReturn(holding.totalReturn),
                      holding.currency,
                    )
                  }}
                  ({{
                    formatTotalReturn(holding.totalReturnPercentage).toFixed(2)
                  }}%)
                </p>
              </div>
            </template>
          </Card>

          <Card
            v-if="holding && holding.class === AssetClass.FIXED_INCOME"
            :pt="{
              root: {
                class: 'rounded-2xl bg-gray-100 shadow-sm',
              },
              title: {
                class: ' text-gray-700',
              },
              content: {
                class: 'text-base text-gray-700 mt-2',
              },
            }"
          >
            <template #title>
              <div class="flex items-center gap-4">
                <img
                  v-if="holding?.quote?.logourl"
                  :src="holding?.quote?.logourl"
                  :alt="holding?.quote?.longName || 'Company logo'"
                  class="rounded-lg w-10"
                />
                <img
                  v-else
                  src="assets/images/telos-finance-logo.png"
                  alt="Telos Finance Logo"
                  class="rounded-lg w-10"
                />

                <div class="flex flex-col">
                  <h1 class="text-base font-semibold">
                    {{ holding.ticker }}
                  </h1>
                  <h2 class="text-xs uppercase">{{ holding.name }}</h2>
                </div>
              </div>
            </template>

            <template #content>
              <div class="flex items-center justify-between">
                <p>Invested</p>
                <p class="font-semibold">
                  {{ formatPrice(holding.avgPrice, holding.currency) }}
                </p>
              </div>

              <div class="flex items-center justify-between">
                <p>Gross Value</p>
                <p class="font-semibold">
                  {{ formatPrice(holding.grossValue, holding.currency) }}
                </p>
              </div>

              <div class="flex items-center justify-between">
                <p>Net Value</p>
                <p class="font-semibold">
                  {{ formatPrice(holding.netValue, holding.currency) }}
                </p>
              </div>

              <div class="flex items-center justify-between">
                <p>Tax</p>
                <p class="font-semibold">
                  {{ formatPrice(holding.totalTax, holding.currency) }}
                </p>
              </div>

              <div class="flex items-center justify-between">
                <p>Net Return</p>
                <p
                  class="font-semibold"
                  :class="getClass(holding.totalNetReturn)"
                >
                  <i :class="getIcon(holding.totalNetReturn)" />
                  {{
                    formatPrice(
                      formatTotalReturn(holding.totalNetReturn),
                      holding.currency,
                    )
                  }}
                  ({{
                    formatTotalReturn(holding.totalReturnPercentage).toFixed(2)
                  }}%)
                </p>
              </div>
            </template>
          </Card>
        </div>

        <div
          class="w-[50%] p-4 border border-gray-200 rounded-2xl flex flex-col gap-4"
        >
          <h2 class="font-bold">Transactions</h2>
          <div v-if="holdingTransactions.length" class="flex flex-col gap-4">
            <div
              v-for="transaction in holdingTransactions"
              :key="transaction.id"
            >
              <Card
                :pt="{
                  root: {
                    class:
                      'rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md',
                  },
                  content: {
                    class: 'text-base text-gray-700',
                  },
                }"
              >
                <template #content>
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center justify-between">
                      <div class="flex gap-1 items-center">
                        <p class="font-bold text-sm">
                          {{ transaction.Holding.ticker }}
                        </p>
                        <p class="text-xs text-gray-500">
                          – {{ transaction.Holding.name }}
                        </p>
                      </div>

                      <div class="flex gap-1">
                        <Button
                          icon="pi pi-ellipsis-v"
                          size="small"
                          severity="secondary"
                          text
                          @click="togglePopover($event, transaction)"
                        />
                      </div>
                    </div>

                    <div class="flex items-start justify-between">
                      <div class="flex flex-col gap-1">
                        <div
                          class="text-xs font-sans font-semibold flex gap-1 items-center"
                        >
                          <div
                            class="flex items-center rounded-full"
                            :class="getTransactionClass(transaction.type)"
                          >
                            <Icon
                              :name="getTransactionTypeIcon(transaction.type)"
                              size="20"
                            />
                          </div>
                          {{ getTransactionTypeLabel(transaction.type) }}
                        </div>

                        <span class="font-normal text-xs text-gray-500">
                          {{ formatDate(transaction.tradeDate) }}
                        </span>
                      </div>

                      <div class="flex flex-col gap-1">
                        <div class="text-sm font-bold">
                          {{
                            formatPrice(
                              Number(transaction.price * transaction.quantity),
                              transaction.currency,
                            )
                          }}
                        </div>
                        <div class="text-xs text-gray-500">
                          {{ Number(transaction.quantity).toFixed(2) }} x
                          {{
                            formatPrice(transaction.price, transaction.currency)
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </Card>
            </div>
          </div>

          <div v-else class="flex items-center justify-center h-full">
            <div class="flex flex-col gap-2 items-center text-gray-500">
              <Icon
                name="solar:sad-square-linear"
                size="24"
                class="text-gray-500"
              />
              <p class="text-sm text-gray-500">No transactions to display</p>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Popover
      ref="popoverRef"
      @show="selectedTransaction = popoverRef.transaction"
    >
      <div class="flex flex-col gap-4">
        <Button
          icon="pi pi-pencil"
          size="small"
          label="Edit"
          severity="secondary"
          text
          fluid
          @click="transactionEditRef.dialogVisible = true"
        />

        <Button
          icon="pi pi-trash"
          label="Delete"
          size="small"
          severity="danger"
          text
          fluid
          @click="transactionDeleteRef.dialogVisible = true"
        />
      </div>
    </Popover>

    <TransactionEdit
      ref="transactionEditRef"
      :walletId="walletId"
      v-model:transaction="selectedTransaction"
      :showButton="false"
      @refresh="init()"
      @resetSelectedTransaction="selectedTransaction = undefined"
    />

    <TransactionDelete
      ref="transactionDeleteRef"
      v-model:transaction="selectedTransaction"
      :showButton="false"
      @refresh="init()"
    />
  </div>
</template>

<script lang="ts" setup>
import { AssetClass } from "@prisma/client";
import type { FormattedHolding, TransactionWithHoldings } from "~/types";

definePageMeta({
  breadcrumbMenu: [
    { label: "Wallets", route: "/wallets" },
    { label: "Wallet", route: "/wallet" },
    { label: "Holding" },
  ],
});

const route = useRoute();
const walletId = route.params.walletId?.toString();
const holdingId = route.params.holdingId?.toString();

const holding = ref<FormattedHolding>();
const holdingTransactions = ref<TransactionWithHoldings[]>([]);

const { getTransactionsById } = useTransactions();
const { getHoldingById } = useHoldings();
const {
  formatDate,
  formatPrice,
  getTransactionClass,
  getTransactionTypeIcon,
  getTransactionTypeLabel,
  formatTotalReturn,
  getClass,
  getIcon,
} = useUtils();

const loading = ref<boolean>(false);

const init = async () => {
  loading.value = true;

  if (holdingId) {
    const res = await getHoldingById(holdingId);
    holding.value = res;
  }

  if (walletId && holdingId) {
    const res = await getTransactionsById(walletId, holdingId);
    holdingTransactions.value = res;
  }

  loading.value = false;
};

const popoverRef = ref();

const togglePopover = (event: Event, transaction: TransactionWithHoldings) => {
  popoverRef.value.toggle(event);
  popoverRef.value.transaction = transaction;
};

const transactionEditRef = ref();
const transactionDeleteRef = ref();
const selectedTransaction = ref<TransactionWithHoldings>();

onMounted(async () => {
  await init();
});
</script>
