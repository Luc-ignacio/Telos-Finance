<template>
  <div class="w-full flex flex-col gap-6">
    <Card
      :pt="{
        root: {
          class: 'rounded-2xl bg-white shadow-sm',
        },
      }"
    >
      <template #content>
        <DataTable
          :value="stocksList"
          :loading="loading"
          paginator
          :rows="10"
          sortField="market_cap"
          :sortOrder="-1"
          removableSort
          v-model:filters="filterStocks"
          filterDisplay="row"
          :globalFilterFields="['stock', 'name']"
        >
          <template #header>
            <div class="flex justify-between items-center">
              <h1 class="text-xl font-title font-bold text-gray-800">Stocks</h1>

              <IconField>
                <InputIcon>
                  <i class="pi pi-search" style="font-size: small" />
                </InputIcon>
                <InputText
                  v-model="filterStocks['global'].value"
                  placeholder="Search Stocks"
                  size="small"
                />
              </IconField>
            </div>
          </template>

          <template #empty> No stocks found. </template>

          <Column header="Image" style="width: 6rem">
            <template #body="slotProps">
              <img
                :src="`${slotProps.data.logo}`"
                :alt="slotProps.data.name"
                class="w-8 rounded-lg"
              />
            </template>
          </Column>

          <Column field="stock" header="Ticker" sortable style="width: 8rem">
          </Column>

          <Column field="name" header="Name" sortable>
            <template #body="slotProps">
              <div class="flex flex-wrap">
                {{ slotProps.data.name }}
              </div>
            </template>
          </Column>

          <Column field="price" header="Price" style="width: 8rem">
            <template #body="slotProps">
              R$ {{ slotProps.data.close.toLocaleString() }}
            </template>
          </Column>

          <Column
            field="market_cap"
            header="Market Cap"
            sortable
            style="width: 10rem"
          >
            <template #body="slotProps">
              {{
                slotProps.data.market_cap
                  ? "R$ " + formatNumber(slotProps.data.market_cap)
                  : "Not Available"
              }}
            </template>
          </Column>

          <Column style="width: 4rem; text-align: right">
            <template #body="slotProps">
              <Button
                icon="pi pi-eye"
                size="small"
                variant="outlined"
                @click="
                  navigateTo({
                    name: 'markets-stocks-ticker',
                    params: { ticker: slotProps.data.stock },
                  })
                "
              />
            </template>
          </Column>

          <template
            #paginatorcontainer="{
              first,
              last,
              page,
              pageCount,
              prevPageCallback,
              nextPageCallback,
              totalRecords,
            }"
          >
            <div
              class="flex items-center gap-4 border border-primary bg-transparent rounded-full w-full py-1 px-2 justify-between"
            >
              <Button
                icon="pi pi-chevron-left"
                rounded
                text
                @click="prevPageCallback"
                :disabled="page === 0"
              />
              <div class="text-color font-medium">
                <span class="hidden sm:block"
                  >Showing {{ first }} to {{ last }} of {{ totalRecords }}</span
                >
                <span class="block sm:hidden"
                  >Page {{ page + 1 }} of {{ pageCount }}</span
                >
              </div>
              <Button
                icon="pi pi-chevron-right"
                rounded
                text
                @click="nextPageCallback"
                :disabled="page === pageCount - 1"
              />
            </div>
          </template>
        </DataTable>
      </template>
    </Card>

    <Card
      :pt="{
        root: {
          class: 'rounded-2xl bg-white shadow-sm',
        },
      }"
    >
      <template #content>
        <DataTable
          :value="fundsList"
          :loading="loading"
          paginator
          :rows="10"
          sortField="name"
          :sortOrder="1"
          removableSort
          v-model:filters="filterFunds"
          filterDisplay="row"
          :globalFilterFields="['stock', 'name']"
        >
          <template #header>
            <div class="flex justify-between items-center">
              <h1 class="text-xl font-title font-bold">Funds</h1>
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" style="font-size: small" />
                </InputIcon>
                <InputText
                  v-model="filterFunds['global'].value"
                  placeholder="Search Funds"
                  size="small"
                />
              </IconField>
            </div>
          </template>

          <template #empty> No funds found. </template>

          <Column header="Image" style="width: 6rem">
            <template #body="slotProps">
              <img
                :src="`${slotProps.data.logo}`"
                :alt="slotProps.data.name"
                class="w-8 rounded-lg"
              />
            </template>
          </Column>

          <Column field="stock" header="Ticker" sortable style="width: 8rem">
          </Column>

          <Column field="name" header="Name" sortable>
            <template #body="slotProps">
              <div class="flex flex-wrap">
                {{ slotProps.data.name }}
              </div>
            </template>
          </Column>

          <Column field="price" header="Price" style="width: 8rem">
            <template #body="slotProps">
              R$ {{ slotProps.data.close.toLocaleString() }}
            </template>
          </Column>

          <template
            #paginatorcontainer="{
              first,
              last,
              page,
              pageCount,
              prevPageCallback,
              nextPageCallback,
              totalRecords,
            }"
          >
            <div
              class="flex items-center gap-4 border border-primary bg-transparent rounded-full w-full py-1 px-2 justify-between"
            >
              <Button
                icon="pi pi-chevron-left"
                rounded
                text
                @click="prevPageCallback"
                :disabled="page === 0"
              />
              <div class="text-color font-medium">
                <span class="hidden sm:block"
                  >Showing {{ first }} to {{ last }} of {{ totalRecords }}</span
                >
                <span class="block sm:hidden"
                  >Page {{ page + 1 }} of {{ pageCount }}</span
                >
              </div>
              <Button
                icon="pi pi-chevron-right"
                rounded
                text
                @click="nextPageCallback"
                :disabled="page === pageCount - 1"
              />
            </div>
          </template>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { FilterMatchMode } from "@primevue/core/api";
import type { QuoteListResponse } from "brapi/resources/quote.mjs";

const { getAllStocks } = useMarkets();
const { formatNumber } = useUtils();

const stocksList = ref<QuoteListResponse.Stock>();
const fundsList = ref<QuoteListResponse.Stock>();
const loading = ref<boolean>();

const filterStocks = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const filterFunds = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

onMounted(async () => {
  loading.value = true;

  const res = await getAllStocks();
  stocksList.value = res.stocksList;
  fundsList.value = res.fundsList;

  loading.value = false;
});
</script>
