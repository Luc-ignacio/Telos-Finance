export default class MarketsRepository {
  static getYearStartDate() {
    const today = new Date();
    const year = today.getFullYear();
    const yearStart = new Date(`01/01/${year}`);

    return yearStart.toLocaleDateString();
  }

  static getLastYearDate() {
    const today = new Date();
    const year = today.getFullYear() - 1;
    const lastYear = new Date(`01/01/${year}`);

    return lastYear.toLocaleDateString();
  }

  static getYesterdayDate() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const day = String(yesterday.getDate()).padStart(2, "0");
    const month = String(yesterday.getMonth() + 1).padStart(2, "0");
    const year = yesterday.getFullYear();

    return `${day}/${month}/${year}`;
  }

  async getInterestRateCDI() {
    const lastYear = MarketsRepository.getLastYearDate();
    const yesterday = MarketsRepository.getYesterdayDate();

    const cdi = await $fetch(
      `https://api.bcb.gov.br/dados/serie/bcdata.sgs.4392/dados?formato=json&dataInicial=${lastYear}&dataFinal=${yesterday}`,
      {
        method: "GET",
      },
    );
    return cdi;
  }
}
