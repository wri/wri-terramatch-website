import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getFundingTypesOptions = (t: typeof useT = (t: string) => t): Option[] => [
  {
    title: t("Private Grant from foundation"),
    value: "private-grant-from-foundation"
  },
  { title: t("Public Grant from Government"), value: "public-grant-from-government" },
  {
    title: t("Loan/Credit Finance from Private Bank or Investor"),
    value: "loan-credit-finance-from-private-bank-or-investor"
  },
  { title: t("Equity from Private Investor"), value: "equity-from-private-investor" },
  { title: t("Product Offtake Contract"), value: "product-offtake-contract" },
  { title: t("Carbon Credits Contract"), value: "carbon-credits-contract" },
  {
    title: t("Public/Private Payments for Ecosystem Services"),
    value: "public-private-payments-for-ecosystem-services"
  },
  { title: t("Other"), value: "other" }
];
