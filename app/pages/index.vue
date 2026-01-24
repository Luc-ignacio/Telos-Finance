<template>
  <div class="flex flex-col w-full gap-5 p-5 rounded-2xl bg-white shadow-sm">
    <h1>CDI Rate</h1>

    {{ cdi }}

    <Select
      v-model="selectedCity"
      :options="intervals"
      optionLabel="label"
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
const { getInterestRateCDI } = useMarkets();

const cdi = ref();

const selectedCity = ref();
const today = new Date();

const intervals = ref([
  { label: `Year To Date`, value: "YEAR_TO_DATE" },
  { label: "12 Months", value: "12M" },
  { label: "Start", value: "START" },
  { label: `${today.getFullYear() - 1}`, value: "LAST_YEAR" },
]);

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "CDI",
        data: cdi.value.map((item) => item.valor),
        fill: false,
        borderColor: documentStyle.getPropertyValue("--p-orange-500"),
        tension: 0.5,
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

onMounted(async () => {
  const response = await getInterestRateCDI();
  cdi.value = response;

  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});
</script>
