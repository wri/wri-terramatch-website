import { FinancialIndicatorDto } from "@/generated/v3/userService/userServiceSchemas";

export const formatDocumentData = (documents: FinancialIndicatorDto[]) => {
  if (documents == null || !Array.isArray(documents)) {
    return [];
  }
  return documents
    .filter(financial => financial?.collection == "description-documents")
    .map(financial => ({ year: String(financial?.year), files: financial?.documentation ?? [] }))
    .sort((a, b) => Number(b.year) - Number(a.year));
};

export const formatDescriptionData = (documents: FinancialIndicatorDto[]) => {
  if (documents == null || !Array.isArray(documents)) {
    return [];
  }
  return documents
    .filter(financial => financial?.collection == "description-documents")
    .map(financial => ({ label: String(financial?.year), description: financial?.description ?? "" }))
    .sort((a, b) => Number(b.label) - Number(a.label));
};

export const formatExchangeData = (documents: FinancialIndicatorDto[]) => {
  if (documents == null || !Array.isArray(documents)) {
    return [];
  }
  return documents
    .filter(financial => financial?.collection == "description-documents")
    .map(financial => ({ label: String(financial?.year), exchangeRate: financial?.exchangeRate ?? 0 }))
    .sort((a, b) => Number(b.label) - Number(a.label));
};

export const currencyInput = {
  USD: "$",
  EUR: "€",
  GBP: "£"
} as any;

type FinancialRatioStats = {
  latestRatio: number;
  latestYear: number;
  averageRatio: number;
  yearRange: string;
  yearCount: number;
};

export const calculateFinancialRatioStats = (financialData: FinancialIndicatorDto[]): FinancialRatioStats => {
  if (financialData == null || !Array.isArray(financialData)) {
    return {
      latestRatio: 0,
      latestYear: new Date().getFullYear(),
      averageRatio: 0,
      yearRange: "",
      yearCount: 0
    };
  }

  const currentRatioData = financialData
    .filter(item => item.collection === "current-ratio")
    .sort((a, b) => a.year - b.year);

  if (currentRatioData.length === 0) {
    return {
      latestRatio: 0,
      latestYear: new Date().getFullYear(),
      averageRatio: 0,
      yearRange: "",
      yearCount: 0
    };
  }

  const latestEntry = currentRatioData[currentRatioData.length - 1];
  const latestRatio = latestEntry.amount ?? 0;
  const latestYear = latestEntry.year;

  const validRatios = currentRatioData.filter(item => item.amount != null);
  const averageRatio =
    validRatios.length > 0 ? validRatios.reduce((sum, item) => sum + (item.amount ?? 0), 0) / validRatios.length : 0;

  const minYear = currentRatioData[0].year;
  const maxYear = currentRatioData[currentRatioData.length - 1].year;
  const yearCount = maxYear - minYear + 1;
  const yearRange = minYear === maxYear ? `${minYear}` : `${minYear} - ${maxYear}`;

  return {
    latestRatio: Math.round(latestRatio * 100) / 100,
    latestYear,
    averageRatio: Math.round(averageRatio * 100) / 100,
    yearRange,
    yearCount
  };
};

export const formatLargeNumber = (value: number, currency: string = ""): string => {
  const absValue = Math.abs(value);

  if (absValue >= 1000000) {
    const millions = value / 1000000;
    const formatted = millions.toFixed(1).replace(/\.0$/, "");
    return `${currency}${formatted}M`;
  } else if (absValue >= 1000) {
    const thousands = value / 1000;
    const formatted = thousands.toFixed(1).replace(/\.0$/, "");
    return `${currency}${formatted}K`;
  } else {
    return `${currency}${value.toLocaleString()}`;
  }
};

export const formatYAxisNumber = (value: number, currency: string = ""): string => {
  if (value === 0) return `${currency}0`;

  const absValue = Math.abs(value);

  if (absValue >= 1000000) {
    const millions = value / 1000000;
    const formatted = millions.toFixed(1).replace(/\.0$/, "");
    return `${currency}${formatted}M`;
  } else if (absValue >= 1000) {
    const thousands = value / 1000;
    const formatted = thousands.toFixed(1).replace(/\.0$/, "");
    return `${currency}${formatted}K`;
  } else {
    return `${currency}${value.toLocaleString()}`;
  }
};

export const formatProfitValue = (value: number, currency: string) => {
  if (value === 0) return `${currency}0`;

  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 1000000) {
    const millions = absValue / 1000000;
    const formatted = millions.toFixed(1).replace(/\.0$/, "");
    return `${sign}${currency}${formatted}M`;
  } else if (absValue >= 1000) {
    const thousands = absValue / 1000;
    const formatted = thousands.toFixed(1).replace(/\.0$/, "");
    return `${sign}${currency}${formatted}K`;
  } else {
    return `${sign}${currency}${absValue.toLocaleString()}`;
  }
};
