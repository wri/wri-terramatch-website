import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getCurrencyOptions = (t: typeof useT = (t: string) => t): Option[] => [
  { title: `${t("USD")} - US Dollar`, value: "USD" },
  { title: `${t("EUR")} - Euro`, value: "EUR" },
  { title: `${t("GBP")} - British Pound`, value: "GBP" },
  { title: `${t("RWF")} - Rwandan Franc`, value: "RWF" },
  { title: `${t("KES")} - Kenyan Shilling`, value: "KES" },
  { title: `${t("GHS")} - Ghanaian Cedi`, value: "GHS" },
  { title: `${t("CDF")} - Congolese Franc`, value: "CDF" },
  { title: `${t("BIF")} - Burundian Franc`, value: "BIF" },
  { title: `${t("BRL")} - Brazilian Real`, value: "BRL" },
  { title: `${t("INR")} - Indian Rupee`, value: "INR" },
  { title: `${t("XOF")} - West African CFA Franc`, value: "XOF" },
  { title: `${t("XAF")} - Central African CFA Franc`, value: "XAF" },
  { title: `${t("SZL")} - Swazi Lilangeni`, value: "SZL" },
  { title: `${t("ZAF")} - South African Rand`, value: "ZAF" },
  { title: `${t("ETB")} - Ethiopian Birr`, value: "ETB" },
  { title: `${t("GNF")} - Guinean Franc`, value: "GNF" },
  { title: `${t("LSL")} - Lesotho Loti`, value: "LSL" },
  { title: `${t("LRD")} - Liberian Dollar`, value: "LRD" },
  { title: `${t("MGA")} - Malagasy Ariary`, value: "MGA" },
  { title: `${t("MWK")} - Malawian Kwacha`, value: "MWK" },
  { title: `${t("MZN")} - Mozambican Metical`, value: "MZN" },
  { title: `${t("NAD")} - Namibian Dollar`, value: "NAD" },
  { title: `${t("NGN")} - Nigerian Naira`, value: "NGN" },
  { title: `${t("SLE")} - Sierra Leonean Leone`, value: "SLE" },
  { title: `${t("SOS")} - Somali Shilling`, value: "SOS" },
  { title: `${t("SDG")} - Sudanese Pound`, value: "SDG" },
  { title: `${t("TZS")} - Tanzanian Shilling`, value: "TZS" },
  { title: `${t("UGX")} - Ugandan Shilling`, value: "UGX" },
  { title: `${t("ZMW")} - Zambian Kwacha`, value: "ZMW" },
  { title: `${t("ZWL")} - Zimbabwean Dollar`, value: "ZWL" }
];
