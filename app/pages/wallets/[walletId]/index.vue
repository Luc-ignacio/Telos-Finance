<template>
  <div class="w-full flex flex-col gap-6">
    <Card
      v-if="loading"
      :pt="{
        root: {
          class: 'rounded-2xl bg-white shadow-sm',
        },
        title: {
          class: 'text-lg text-gray-700',
        },
        content: {
          class: 'text-gray-700',
        },
      }"
    >
      <template #title>
        <div class="flex items-center justify-between">
          <Skeleton height="2rem" width="8rem" borderRadius="8px"></Skeleton>

          <div class="flex items-center gap-8">
            <Skeleton height="3rem" width="8rem" borderRadius="8px"></Skeleton>
            <Skeleton height="3rem" width="8rem" borderRadius="8px"></Skeleton>
            <Skeleton height="3rem" width="11rem" borderRadius="8px"></Skeleton>
          </div>
        </div>
        <Divider />
      </template>

      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <Skeleton height="2rem" width="8rem" borderRadius="8px"></Skeleton>

            <Skeleton
              height="2.5rem"
              width="10rem"
              borderRadius="8px"
            ></Skeleton>
          </div>
          <div class="grid grid-cols-2 gap-4 w-full">
            <Skeleton height="13rem" width="full"></Skeleton>
            <Skeleton height="13rem" width="full"></Skeleton>
            <Skeleton height="13rem" width="full"></Skeleton>
            <Skeleton height="13rem" width="full"></Skeleton>
          </div>
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
          class: 'text-lg text-gray-700',
        },
        content: {
          class: 'text-gray-700',
        },
      }"
    >
      <template #title>
        <div class="flex flex-col lg:flex-row lg:items-center justify-between">
          <h1 class="font-semibold">{{ wallet?.name }}</h1>
          <div
            v-if="
              wallet?.totalValue && wallet?.totalInvested && wallet?.totalReturn
            "
            class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-8 mt-4 lg:mt-0"
          >
            <div class="flex flex-col">
              <p>
                {{
                  formatPrice(wallet?.totalValue, wallet?.Holdings[0]?.currency)
                }}
              </p>
              <span class="text-xs font-light lg:text-right">Total Value</span>
            </div>

            <div class="flex flex-col">
              <p>
                {{
                  formatPrice(
                    wallet?.totalInvested,
                    wallet?.Holdings[0]?.currency,
                  )
                }}
              </p>
              <span class="text-xs font-light lg:text-right"
                >Total Invested</span
              >
            </div>

            <div class="flex flex-col" :class="getClass(wallet?.totalReturn)">
              <p>
                <i :class="getIcon(wallet?.totalReturn)" />
                {{
                  formatPrice(
                    formatTotalReturn(wallet?.totalReturn),
                    wallet?.Holdings[0]?.currency,
                  )
                }}
                ({{
                  formatTotalReturn(wallet?.totalReturnPercentage).toFixed(2)
                }}%)
              </p>
              <span class="text-xs font-light lg:text-right">Total Return</span>
            </div>
          </div>
          <TransactionAdd v-else :walletId="walletId" @refresh="init()" />
        </div>
        <Divider />
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

        <div v-else class="grid gri-cols-1 lg:grid-cols-2 gap-4 w-full">
          <span
            class="col-span-1 lg:col-span-2 flex items-center justify-between"
          >
            My holdings
            <TransactionAdd :walletId="walletId" @refresh="init()" />
          </span>

          <div v-for="holding in wallet.Holdings" :key="holding.id">
            <Card
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
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <img
                      :src="holding?.quote?.logourl"
                      :alt="holding?.quote?.longName || 'Company logo'"
                      class="rounded-lg w-10"
                    />
                    <div class="flex flex-col">
                      <h1 class="text-base font-semibold">
                        {{ holding.ticker }}
                      </h1>
                      <h2 class="text-xs uppercase">{{ holding.name }}</h2>
                    </div>
                  </div>

                  <Button
                    icon="pi pi-ellipsis-v"
                    severity="secondary"
                    text
                    @click="togglePopover($event, holding)"
                  />
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
                  <p
                    class="font-semibold"
                    :class="getClass(holding.totalReturn)"
                  >
                    <i :class="getIcon(holding.totalReturn)" />
                    {{
                      formatPrice(
                        formatTotalReturn(holding.totalReturn),
                        holding.currency,
                      )
                    }}
                    ({{
                      formatTotalReturn(holding.totalReturnPercentage).toFixed(
                        2,
                      )
                    }}%)
                  </p>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </template>
    </Card>

    <Popover ref="popoverRef" @show="selectedHolding = popoverRef.holding">
      <div class="flex flex-col gap-4">
        <Button
          icon="pi pi-eye"
          size="small"
          label="View"
          severity="secondary"
          text
          fluid
          @click="
            navigateTo({
              name: 'wallets-walletId-holdings-holdingId',
              params: {
                walletId: wallet?.id,
                holdingId: popoverRef.holding.id,
              },
            })
          "
        />

        <Button
          icon="pi pi-trash"
          label="Delete"
          size="small"
          severity="danger"
          text
          fluid
          @click="holdingDeleteRef.dialogVisible = true"
        />
      </div>
    </Popover>

    <HoldingDelete
      ref="holdingDeleteRef"
      v-model:holding="selectedHolding"
      :showButton="false"
      @refresh="init()"
    />
  </div>
</template>

<script lang="ts" setup>
import type { FormattedHolding, FormattedWallet } from "~/types";

definePageMeta({
  breadcrumbMenu: [
    { label: "Wallets", route: "/wallets" },
    { label: "Wallet" },
  ],
});

const route = useRoute();
const walletId = route.params.walletId?.toString();

const wallet = ref<FormattedWallet>();

const { getWalletById } = useWallets();
const { formatPrice, formatTotalReturn, getClass, getIcon } = useUtils();

const loading = ref<boolean>(false);

const init = async () => {
  loading.value = true;
  if (walletId) {
    const res = await getWalletById(walletId);
    wallet.value = res;
  }
  loading.value = false;
};

const popoverRef = ref();
const selectedHolding = ref<FormattedHolding>();

const togglePopover = (event: Event, holding: FormattedHolding) => {
  popoverRef.value.toggle(event);
  popoverRef.value.holding = holding;
};

const holdingDeleteRef = ref();

onMounted(async () => {
  await init();
});
</script>
