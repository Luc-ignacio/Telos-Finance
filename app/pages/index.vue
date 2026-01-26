<template>
  <div class="flex flex-col w-full gap-5 p-5 rounded-2xl bg-white shadow-sm">
    <h1>CDI Rate</h1>

    <Select
      v-model="selectedYieldInterval"
      :options="intervals"
      optionLabel="label"
      optionValue="value"
      placeholder="Select interval"
    />

    <Chart
      type="line"
      :data="chartData"
      :options="chartOptions"
      class="h-[30rem]"
    />
  </div>
</template>

<script lang="ts" setup>
import { YieldIntervals } from "~/types";

const { getInterestRateCDI } = useMarkets();

const cdiData = ref();
const cdbYieldData = ref();

const selectedYieldInterval = ref<YieldIntervals>(YieldIntervals.TWELVE_MONTHS);
const today = new Date();

const intervals = ref([
  { label: `Year To Date`, value: YieldIntervals.YEAR_TO_DATE },
  { label: "12 Months", value: YieldIntervals.TWELVE_MONTHS },
  { label: `${today.getFullYear() - 1}`, value: YieldIntervals.LAST_YEAR },
]);

watch(selectedYieldInterval, async (newValue) => {
  if (newValue) {
    await fetchCDI();
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
  }
});

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: cdbYieldData.value.grossYieldData.map((item) => item.date),
    datasets: [
      {
        label: "CDI Year",
        data: cdbYieldData.value.grossYieldData.map(
          (item) => item.accumulatedGrossYield,
        ),
        fill: false,
        yAxisID: "y",
        borderColor: documentStyle.getPropertyValue("--p-orange-500"),
        tension: 0.4,
      },
      {
        label: "CDI Day",
        data: cdiData.value.map((item) => item.valor),
        fill: false,
        yAxisID: "y1",
        borderColor: documentStyle.getPropertyValue("--p-lime-500"),
        tension: 0.4,
      },
    ],
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--p-text-color");
  const textColorSecondary = documentStyle.getPropertyValue(
    "--p-text-muted-color",
  );
  const surfaceBorder = documentStyle.getPropertyValue(
    "--p-content-border-color",
  );

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
};

const fetchCDI = async () => {
  const { cdi, CDBYield } = await getInterestRateCDI(
    selectedYieldInterval.value,
  );
  cdiData.value = cdi;
  cdbYieldData.value = CDBYield;
};

onMounted(async () => {
  await fetchCDI();
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});
</script>
