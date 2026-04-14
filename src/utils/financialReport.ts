import { FieldDefinition } from "@/components/extensive/WizardForm/types";
import { FinancialIndicatorDto } from "@/generated/v3/userService/userServiceSchemas";

const LOCALE_BY_ISO_CURRENCY: Record<string, string> = {
  BRL: "pt-BR",
  EUR: "de-DE",
  GBP: "en-GB",
  CHF: "de-CH",
  NOK: "nb-NO",
  SEK: "sv-SE",
  DKK: "da-DK",
  PLN: "pl-PL",
  TRY: "tr-TR"
};

export function getLocaleForIsoCurrency(currencyCode: string | undefined): string {
  if (currencyCode == null || currencyCode === "") {
    return "en-US";
  }
  return LOCALE_BY_ISO_CURRENCY[currencyCode] ?? "en-US";
}

function usesCommaDecimalLocale(locale: string): boolean {
  return locale === "pt-BR" || locale === "de-DE" || locale === "de-CH" || locale === "de-AT";
}

export const currencyInput: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£"
};

/**
 * Normalizes a user-typed amount string to a JS decimal string (`.` as decimal separator).
 */
export function parseFinancialAmountInput(raw: string, currencyCode: string | undefined): number | null {
  const trimmed = raw.trim().replace(/\s/g, "");
  if (trimmed === "") {
    return null;
  }
  const locale = getLocaleForIsoCurrency(currencyCode);
  const normalized = usesCommaDecimalLocale(locale)
    ? trimmed.replace(/\./g, "").replace(",", ".")
    : trimmed.replace(/,/g, "");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

/** Formats a monetary amount for display (2 decimals). Backend values remain plain decimal numbers. */
export function formatFinancialAmount(value: number, currencyCode: string | undefined): string {
  if (!Number.isFinite(value)) {
    return "";
  }
  const locale = getLocaleForIsoCurrency(currencyCode);
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function formatMonetaryCanonicalForDisplay(
  value: number | null | undefined,
  currencyCode: string | undefined
): string {
  if (value == null || !Number.isFinite(value)) {
    return "";
  }
  return formatFinancialAmount(value, currencyCode);
}

export function getCurrencySymbolPrefix(currencyCode: string | undefined): string {
  if (currencyCode == null || currencyCode === "") {
    return "";
  }
  const fromMap = currencyInput[currencyCode];
  if (typeof fromMap === "string" && fromMap.length > 0) {
    return fromMap;
  }
  try {
    const parts = new Intl.NumberFormat("en", {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol"
    }).formatToParts(0);
    const sym = parts.find(p => p.type === "currency")?.value;
    return sym ?? "";
  } catch {
    return "";
  }
}

function linkedKeyMatchesFinancialPatterns(linkedFieldKey: string | null | undefined): boolean {
  if (linkedFieldKey == null || linkedFieldKey === "") {
    return false;
  }
  const k = linkedFieldKey.toLowerCase().replace(/_/g, "-");
  if (k.includes("lat-") || k.includes("long-")) {
    return false;
  }
  if (k === "pro-pit-bgt") {
    return true;
  }
  if (k.includes("average-worker-income") || k.includes("averageworkerincome")) {
    return true;
  }
  if (k.includes("project-budget") || k.includes("projectbudget")) {
    return true;
  }
  if (k.includes("loan-status-amount") || k.includes("loanstatusamount")) {
    return true;
  }
  if (/-budget$/.test(k) || k.endsWith("budget")) {
    return true;
  }
  return false;
}

export function shouldFormatFinancialNumberField(field: FieldDefinition): boolean {
  if (field.additionalProps?.financialAmount === true) {
    return true;
  }
  if (field.inputType === "number-currency") {
    return true;
  }
  if (field.linkedFieldKey?.includes("lat-") || field.linkedFieldKey?.includes("long-")) {
    return false;
  }
  return linkedKeyMatchesFinancialPatterns(field.linkedFieldKey);
}

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

export const formatLargeNumber = (value: number, currencySymbol: string = "", isoCurrency?: string): string => {
  const absValue = Math.abs(value);
  const locale = getLocaleForIsoCurrency(isoCurrency);

  if (absValue >= 1000000) {
    const millions = value / 1000000;
    const formatted = millions.toFixed(1).replace(/\.0$/, "");
    return `${currencySymbol}${formatted}M`;
  } else if (absValue >= 1000) {
    const thousands = value / 1000;
    const formatted = thousands.toFixed(1).replace(/\.0$/, "");
    return `${currencySymbol}${formatted}K`;
  } else {
    return `${currencySymbol}${value.toLocaleString(locale)}`;
  }
};

export const formatYAxisNumber = (value: number, currencySymbol: string = "", isoCurrency?: string): string => {
  if (value === 0) return `${currencySymbol}0`;

  const absValue = Math.abs(value);
  const locale = getLocaleForIsoCurrency(isoCurrency);

  if (absValue >= 1000000) {
    const millions = value / 1000000;
    const formatted = millions.toFixed(1).replace(/\.0$/, "");
    return `${currencySymbol}${formatted}M`;
  } else if (absValue >= 1000) {
    const thousands = value / 1000;
    const formatted = thousands.toFixed(1).replace(/\.0$/, "");
    return `${currencySymbol}${formatted}K`;
  } else {
    return `${currencySymbol}${value.toLocaleString(locale)}`;
  }
};

export const formatProfitValue = (value: number, currencySymbol: string, isoCurrency?: string) => {
  if (value === 0) return `${currencySymbol}0`;

  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  const locale = getLocaleForIsoCurrency(isoCurrency);

  if (absValue >= 1000000) {
    const millions = absValue / 1000000;
    const formatted = millions.toFixed(1).replace(/\.0$/, "");
    return `${sign}${currencySymbol}${formatted}M`;
  } else if (absValue >= 1000) {
    const thousands = absValue / 1000;
    const formatted = thousands.toFixed(1).replace(/\.0$/, "");
    return `${sign}${currencySymbol}${formatted}K`;
  } else {
    return `${sign}${currencySymbol}${absValue.toLocaleString(locale)}`;
  }
};
