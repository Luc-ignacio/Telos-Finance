import { YieldIntervals } from "~/types";
import { CDIData, CDBYieldResult } from "../types/api";

export default class MarketsRepository {
  static formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  static getCurrentYearStartDate() {
    const today = new Date();
    const year = today.getFullYear();
    const currentYearStart = new Date(year, 0, 1);

    return this.formatDate(currentYearStart);
  }

  static getLastYearStartDate() {
    const today = new Date();
    const previousYear = today.getFullYear() - 1;
    const lastYearStart = new Date(previousYear, 0, 1);

    return this.formatDate(lastYearStart);
  }

  static getLastYearEndDate() {
    const today = new Date();
    const previousYear = today.getFullYear() - 1;
    const lastYearEnd = new Date(previousYear, 11, 31);

    return this.formatDate(lastYearEnd);
  }

  static getTwelveMonthStartDate() {
    const today = new Date();
    const previousYear = today.getFullYear() - 1;
    const twelveMonthStart = new Date(
      previousYear,
      today.getMonth(),
      today.getDate(),
    );

    return this.formatDate(twelveMonthStart);
  }

  static getYesterdayDate() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return this.formatDate(yesterday);
  }

  async getInterestRateCDI(interval: YieldIntervals) {
    let startDate;
    let endDate;

    if (interval === YieldIntervals.YEAR_TO_DATE) {
      startDate = MarketsRepository.getCurrentYearStartDate();
      endDate = MarketsRepository.getYesterdayDate();
    } else if (interval === YieldIntervals.TWELVE_MONTHS) {
      startDate = MarketsRepository.getTwelveMonthStartDate();
      endDate = MarketsRepository.getYesterdayDate();
    } else if (interval === YieldIntervals.LAST_YEAR) {
      startDate = MarketsRepository.getLastYearStartDate();
      endDate = MarketsRepository.getLastYearEndDate();
    }

    const cdi = (await $fetch(
      `https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados?formato=json&dataInicial=${startDate}&dataFinal=${endDate}`,
      {
        method: "GET",
      },
    )) as CDIData[];

    let CDBYield;
    if (startDate && endDate) {
      const response = MarketsRepository.calculateCDBYield(
        1000,
        100,
        cdi,
        startDate,
        endDate,
      );

      CDBYield = response as CDBYieldResult;
    }

    return { cdi, CDBYield };
  }

  static calculateCalendarDays(startDate: string, endDate: string): number {
    const [dayStart, monthStart, yearStart] = startDate.split("/").map(Number);
    const [dayEnd, monthEnd, yearEnd] = endDate.split("/").map(Number);

    const start = new Date(yearStart, monthStart - 1, dayStart);
    const end = new Date(yearEnd, monthEnd - 1, dayEnd);

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  static calculateTaxRate(calendarDays: number): number {
    if (calendarDays <= 180) return 0.225; // 22.5%
    if (calendarDays <= 360) return 0.2; // 20%
    if (calendarDays <= 720) return 0.175; // 17.5%
    return 0.15; // 15%
  }

  static calculateCDBYield(
    initialValue: number,
    cdiPercentage: number,
    cdiData: CDIData[],
    startDate: string,
    endDate: string,
  ): CDBYieldResult {
    // STEP 1: Initialize accumulated factor at 1
    let accumulatedFactor = 1.0;

    // STEP 2: For each day, multiply the factor
    for (const day of cdiData) {
      // Convert to decimal
      const dailyCDI = parseFloat(day.valor) / 100;

      // Apply CDI percentage (100%, 110%, etc)
      const adjustedCDI = dailyCDI * (cdiPercentage / 100);

      // Calculate day factor
      const dayFactor = 1 + adjustedCDI;

      // Accumulate (multiply)
      accumulatedFactor *= dayFactor;
    }

    let grossYieldData: Array<{ date: string; accumulatedGrossYield: number }> =
      [];

    let grossYieldAccumulatedFactor = 1.0;

    const grossYieldMap = cdiData.map((day) => {
      // Convert to decimal
      const dailyCDI = parseFloat(day.valor) / 100;

      // Apply CDI percentage (100%, 110%, etc)
      const adjustedCDI = dailyCDI * (cdiPercentage / 100);

      // Calculate day factor
      const dayFactor = 1 + adjustedCDI;

      // Accumulate (multiply)
      grossYieldAccumulatedFactor *= dayFactor;

      return grossYieldData.push({
        date: day.data,
        accumulatedGrossYield: (grossYieldAccumulatedFactor - 1) * 100,
      });
    });

    // STEP 3: Calculate gross yield
    const grossYield = (accumulatedFactor - 1) * 100;

    // STEP 4: Calculate gross value
    const grossValue = initialValue * accumulatedFactor;
    const grossReturn = grossValue - initialValue;

    // STEP 5: Calculate income tax
    const calendarDays = this.calculateCalendarDays(startDate, endDate);
    const taxRate = this.calculateTaxRate(calendarDays);
    const tax = grossReturn * taxRate;

    // STEP 6: Calculate net value
    const netValue = grossValue - tax;
    const netYield = (netValue / initialValue - 1) * 100;

    return {
      businessDays: cdiData.length,
      calendarDays,
      accumulatedFactor: Number(accumulatedFactor.toFixed(2)),
      grossYield: Number(grossYield.toFixed(2)),
      grossYieldData,
      grossValue: Number(grossValue.toFixed(2)),
      grossReturn: Number(grossReturn.toFixed(2)),
      taxRate,
      tax: Number(tax.toFixed(2)),
      netValue: Number(netValue.toFixed(2)),
      netYield: Number(netYield.toFixed(2)),
    };
  }
}
