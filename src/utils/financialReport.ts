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

function hasIntegerNumberAdditionalProps(field: FieldDefinition): boolean {
  const props = field.additionalProps;
  if (props == null) {
    return false;
  }
  return props.integer === true || props.integerOnly === true || props.decimals === 0 || props.precision === 0;
}

function isLegacyProjectBudgetField(field: FieldDefinition): boolean {
  const model = String(field.model ?? "").toLowerCase();
  const isProjectModel = model === "projects" || model === "project-pitches" || model === "projectpitches";
  // Temporary compatibility fallback until these questions are explicitly configured via additionalProps.
  // If project/pitch budget was switched to number-currency via backend data migration, force integer behavior.
  return isProjectModel && field.inputType === "number-currency" && field.additionalProps?.financialAmount !== true;
}

export function shouldUseIntegerNumberInput(field: FieldDefinition): boolean {
  return hasIntegerNumberAdditionalProps(field) || isLegacyProjectBudgetField(field);
}

export function shouldFormatFinancialNumberField(field: FieldDefinition): boolean {
  if (shouldUseIntegerNumberInput(field)) {
    return false;
  }
  if (field.additionalProps?.financialAmount === true) {
    return true;
  }
  return field.inputType === "number-currency";
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

export const NON_PROFIT_ORGANISATION_TYPE = "non-profit-organization";

/** A current ratio at or above this value (current assets cover current liabilities) is considered healthy. */
export const HEALTHY_CURRENT_RATIO = 1;

export type FinancialYearSummary = {
  year: number;
  revenue: number | null;
  expenses: number | null;
  profit: number | null;
  currentRatio: number | null;
  currentAssets: number | null;
  currentLiabilities: number | null;
  budget: number | null;
};

const FINANCIAL_SUMMARY_KEYS: Record<string, keyof Omit<FinancialYearSummary, "year">> = {
  revenue: "revenue",
  expenses: "expenses",
  profit: "profit",
  "current-ratio": "currentRatio",
  "current-assets": "currentAssets",
  "current-liabilities": "currentLiabilities",
  budget: "budget"
};

const USD = "USD";

/**
 * Builds the multiplier that converts a year's local-currency amounts to USD
 * (local amount × that year's exchange rate). Years without a usable rate cannot be converted.
 */
const getUsdConversion = (collection: FinancialIndicatorDto[], currency: string | null) => {
  if (currency == null || currency === USD) return () => 1;

  const rates = new Map(
    collection
      .filter(({ collection: name, exchangeRate }) => name === "description-documents" && exchangeRate != null)
      .map(({ year, exchangeRate }) => [year, exchangeRate as number])
  );
  return (year: number) => {
    const rate = rates.get(year);
    return rate == null || rate === 0 ? null : rate;
  };
};

/**
 * Groups financial indicators into one summary row per year, sorted by year. Monetary values are
 * converted to USD; a value that can't be converted (no exchange rate for its year) is null.
 */
export const getFinancialYearSummaries = (
  collection: FinancialIndicatorDto[],
  currency: string | null
): FinancialYearSummary[] => {
  const usdMultiplier = getUsdConversion(collection, currency);
  const byYear = new Map<number, FinancialYearSummary>();
  for (const { year, collection: collectionName, amount: rawAmount } of collection) {
    const key = FINANCIAL_SUMMARY_KEYS[collectionName];
    if (key == null) continue;

    const multiplier = key === "currentRatio" ? 1 : usdMultiplier(year);
    const amount = rawAmount == null || multiplier == null ? null : rawAmount * multiplier;

    const summary = byYear.get(year) ?? {
      year,
      revenue: null,
      expenses: null,
      profit: null,
      currentRatio: null,
      currentAssets: null,
      currentLiabilities: null,
      budget: null
    };
    summary[key] = amount;
    byYear.set(year, summary);
  }

  return [...byYear.values()]
    .map(summary => ({
      ...summary,
      profit:
        summary.profit ??
        (summary.revenue != null && summary.expenses != null ? summary.revenue - summary.expenses : null),
      currentRatio:
        summary.currentRatio ??
        (summary.currentAssets != null && summary.currentLiabilities != null && summary.currentLiabilities !== 0
          ? summary.currentAssets / summary.currentLiabilities
          : null)
    }))
    .sort((a, b) => a.year - b.year);
};

/**
 * Sums funding source amounts (already stored in USD) per year. Covers the given financial indicator
 * years (falling back to the funding years when there are none); a year without funding is null.
 */
export const getExternalFinanceByYear = (
  fundingTypes: { year: number | null; amount: number | null }[],
  indicatorYears: number[]
) => {
  const byYear = new Map<number, number>();
  for (const { year, amount } of fundingTypes) {
    if (year == null || amount == null) continue;
    byYear.set(year, (byYear.get(year) ?? 0) + amount);
  }

  const years = indicatorYears.length > 0 ? indicatorYears : [...byYear.keys()];
  return [...years].sort((a, b) => a - b).map(year => ({ year, amount: byYear.get(year) ?? null }));
};

/** Full-precision USD display for chart tooltips (e.g. "$123,000"). */
export const formatUsdAmount = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: USD, maximumFractionDigits: 0 }).format(value);

/** Compact USD display for chart axes (e.g. "$150K", "-$5M"). */
export const formatCompactUsd = (value: number) => formatProfitValue(value, currencyInput[USD]);
