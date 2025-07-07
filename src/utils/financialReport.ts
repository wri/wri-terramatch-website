import { V2FinancialIndicatorsRead } from "@/generated/apiSchemas";

export const formatDocumentData = (documents: V2FinancialIndicatorsRead) => {
  return documents
    ?.filter(financial => financial?.collection == "description-documents")
    .map(financial => ({ year: financial?.year, files: financial?.documentation }));
};

export const formatDescriptionData = (documents: V2FinancialIndicatorsRead) => {
  return documents
    ?.filter(financial => financial?.collection == "description-documents")
    .map(financial => ({ label: financial?.year, description: financial?.description }));
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
