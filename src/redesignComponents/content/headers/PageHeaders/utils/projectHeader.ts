import { ProgressState } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";

import { FLAG_OFFSET, ISO_ALPHA3_TO_ALPHA2 } from "../constants/projectHeader";

export const convertToFlagEmoji = (isoCode: string): string =>
  isoCode.toUpperCase().replace(/./g, char => String.fromCodePoint(FLAG_OFFSET + char.charCodeAt(0)));

export const countryCodeToFlag = (code: string | string[] | null | undefined): string => {
  if (code == null) return "";

  const value = Array.isArray(code) ? code[0] : code;
  const upper = value.trim().toUpperCase();
  if (upper.length === 0) return "";

  if (/^[A-Z]{2}$/.test(upper)) {
    return convertToFlagEmoji(upper);
  }

  if (/^[A-Z]{3}$/.test(upper) && ISO_ALPHA3_TO_ALPHA2[upper]) {
    return convertToFlagEmoji(ISO_ALPHA3_TO_ALPHA2[upper]);
  }

  return convertToFlagEmoji(upper.slice(0, 2));
};

export const formatMonthYear = (date?: string | null): string => {
  if (date == null) return "-";

  const trimmed = date.trim();
  if (trimmed.length === 0) return "-";

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return "-";

  return `${String(parsed.getUTCMonth() + 1).padStart(2, "0")}/${parsed.getUTCFullYear()}`;
};

export const mapPlantingStatusToProgressState = (status?: string | null): ProgressState | null => {
  switch (status) {
    case "in-progress":
      return "in-progress";
    case "completed":
      return "completed";
    case "not-started":
      return "not-started";
    default:
      return null;
  }
};
