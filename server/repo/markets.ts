import { YieldIntervals } from "~/types";
import {
  CDIData,
  CalculateYieldResult,
  FixedIncomeValueMultipleTransactionsResult,
  FixedIncomeValueSingleTransactionResult,
} from "../types/api";
import { FixedIncomeIndexer, Holding, Transaction } from "@prisma/client";

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

  async fetchCDI(startDate: string, endDate: string): Promise<CDIData[]> {
    try {
      const cdi = (await $fetch(
        `https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados?formato=json&dataInicial=${startDate}&dataFinal=${endDate}`,
        {
          method: "GET",
        },
      )) as CDIData[];

      return cdi;
    } catch (error) {
      console.error("Error fetching CDI:", error);
      throw error;
    }
  }

  async fetchSELIC(startDate: string, endDate: string): Promise<CDIData[]> {
    try {
      const selic = (await $fetch(
        `https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados?formato=json&dataInicial=${startDate}&dataFinal=${endDate}`,
        {
          method: "GET",
        },
      )) as CDIData[];

      return selic;
    } catch (error) {
      console.error("Error fetching SELIC:", error);
      throw error;
    }
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

  static calculateYield(
    initialValue: number,
    cdiPercentage: number,
    cdiData: CDIData[],
    startDate: string,
    endDate: string,
  ): CalculateYieldResult {
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

  async calculateFixedIncomeValueSingleTransaction(
    totalInvested: number,
    indexer: FixedIncomeIndexer,
    indexerRate: number,
    purchaseDate: Date,
  ): Promise<FixedIncomeValueSingleTransactionResult> {
    const startDate = MarketsRepository.formatDate(purchaseDate);
    const endDate = MarketsRepository.getYesterdayDate();

    try {
      let indexData: CDIData[] = [];

      // STEP 1: Fetch indexer data
      if (indexer === FixedIncomeIndexer.CDI) {
        indexData = await this.fetchCDI(startDate, endDate);
      } else if (indexer === FixedIncomeIndexer.SELIC) {
        indexData = await this.fetchSELIC(startDate, endDate);
      } else if (indexer === FixedIncomeIndexer.IPCA) {
        // TODO: Implement IPCA calculation
        return {
          totalInvested,
          totalGrossValue: totalInvested,
          totalNetValue: totalInvested,
          taxRate: 0,
          tax: 0,
          totalReturn: 0,
          totalReturnPercentage: 0,
        };
      } else if (indexer === FixedIncomeIndexer.FIXED_RATE) {
        // TODO: Implement fixed rate calculation
        return {
          totalInvested,
          totalGrossValue: totalInvested,
          totalNetValue: totalInvested,
          taxRate: 0,
          tax: 0,
          totalReturn: 0,
          totalReturnPercentage: 0,
        };
      }

      // Step 2: Calculate yield using existing method
      const result = MarketsRepository.calculateYield(
        totalInvested,
        indexerRate,
        indexData,
        startDate,
        endDate,
      );

      return {
        totalInvested,
        totalGrossValue: result.grossValue,
        totalNetValue: result.netValue,
        taxRate: result.taxRate,
        tax: result.tax,
        totalReturn: result.netValue - totalInvested,
        totalReturnPercentage: result.netYield,
      };
    } catch (error) {
      console.error("Error calculating application value:", error);
      return {
        totalInvested,
        totalGrossValue: totalInvested,
        totalNetValue: totalInvested,
        taxRate: 0,
        tax: 0,
        totalReturn: 0,
        totalReturnPercentage: 0,
      };
    }
  }

  async calculateFixedIncomeValueMultipleTransactions(
    holding: Holding & { Transactions: Transaction[] },
  ): Promise<FixedIncomeValueMultipleTransactionsResult> {
    // Step 1: Get all BUY transactions
    const buyTransactions = holding.Transactions.filter(
      (transaction) => transaction.type === "BUY",
    ).sort((a, b) => a.tradeDate.getTime() - b.tradeDate.getTime());

    let totalInvested = 0;
    let totalGrossValue = 0;
    let totalNetValue = 0;
    let totalTax = 0;
    const applications = [];

    for (const transaction of buyTransactions) {
      const paidValue = Number(transaction.price);
      totalInvested += paidValue;

      const result = await this.calculateFixedIncomeValueSingleTransaction(
        paidValue,
        holding.fixedIncomeIndexer!,
        Number(holding.fixedIncomeRate) || 100,
        transaction.tradeDate,
      );

      totalGrossValue += result.totalGrossValue;
      totalNetValue += result.totalNetValue;
      totalTax += result.tax;

      applications.push({
        date: transaction.tradeDate,
        invested: result.totalInvested,
        grossValue: result.totalGrossValue,
        netValue: result.totalNetValue,
        taxRate: result.taxRate,
        tax: result.tax,
        grossReturn: result.totalGrossValue - result.totalInvested,
        netReturn: result.totalReturn,
        returnPercentage: result.totalReturnPercentage,
      });
    }

    // Step 2: Subtract any redemptions
    const redemptions = holding.Transactions.filter(
      (t) => t.type === "REDEMPTION" || t.type === "MATURITY",
    );

    for (const redemption of redemptions) {
      const redeemedAmount = Number(redemption.price);
      totalNetValue -= redeemedAmount;
      totalGrossValue -= redeemedAmount;
      totalInvested -= redeemedAmount;
    }

    const totalGrossReturn = totalGrossValue - totalInvested;
    const totalNetReturn = totalNetValue - totalInvested;
    const totalReturnPercentage =
      totalInvested > 0 ? (totalNetReturn / totalInvested) * 100 : 0;

    return {
      totalInvested,
      totalGrossValue,
      totalNetValue,
      totalTax,
      totalGrossReturn,
      totalNetReturn,
      totalReturnPercentage,
      applications,
    };
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

    const cdi = await this.fetchCDI(startDate!, endDate!);

    let CDBYield;
    if (startDate && endDate) {
      const response = MarketsRepository.calculateYield(
        1000,
        100,
        cdi,
        startDate,
        endDate,
      );

      CDBYield = response as CalculateYieldResult;
    }

    return { cdi, CDBYield };
  }
}
