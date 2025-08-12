import { V2FinancialIndicatorsRead } from "@/generated/apiSchemas";

export const formatDocumentData = (documents: V2FinancialIndicatorsRead) => {
  return documents
    ?.filter(financial => financial?.collection == "description-documents")
    .map(financial => ({ year: financial?.year, files: financial?.documentation }))
    .sort((a, b) => b.year - a.year);
};

export const formatDescriptionData = (documents: V2FinancialIndicatorsRead) => {
  return documents
    ?.filter(financial => financial?.collection == "description-documents")
    .map(financial => ({ label: financial?.year, description: financial?.description }))
    .sort((a, b) => b.label - a.label);
};

export const formatExchangeData = (documents: V2FinancialIndicatorsRead) => {
  return documents
    ?.filter(financial => financial?.collection == "description-documents")
    .map(financial => ({ label: financial?.year, exchangeRate: financial?.exchange_rate }))
    .sort((a, b) => b.label - a.label);
};

export const currencyInput = {
  USD: "$",
  EUR: "€",
  GBP: "£"
} as any;

type FinancialDataItem = {
  uuid: string;
  organisation_id: number;
  financial_report_id: number;
  collection: string;
  amount: number | null;
  year: number;
  description: string | null;
  documentation: any[];
};

type FinancialRatioStats = {
  latestRatio: number;
  latestYear: number;
  averageRatio: number;
  yearRange: string;
  yearCount: number;
};

export const calculateFinancialRatioStats = (financialData: FinancialDataItem[]): FinancialRatioStats => {
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
  const latestRatio = latestEntry.amount || 0;
  const latestYear = latestEntry.year;

  const validRatios = currentRatioData.filter(item => item.amount !== null);
  const averageRatio =
    validRatios.length > 0 ? validRatios.reduce((sum, item) => sum + (item.amount || 0), 0) / validRatios.length : 0;

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
