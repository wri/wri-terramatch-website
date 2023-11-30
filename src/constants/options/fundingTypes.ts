import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getFundingTypesOptions = (t: typeof useT = (t: string) => t): Option[] => [
  {
    title: t("Private grant from foundation"),
    value: "private_grant_from_foundation"
  },
  { title: t("Public Grant from Government"), value: "public_grant_from_government" },
  {
    title: t("Loan/Credit Finance from Private Bank or Investor"),
    value: "loan_credit_finance_from_private_bank_or_investor"
  },
  { title: t("Equity from Private Investor"), value: "equity_from_private_investor" },
  { title: t("Product Offtake Contract"), value: "product_offtake_contract" },
  { title: t("Carbon Credits Contract"), value: "carbon_credits_contract" },
  {
    title: t("Public/Private Payments for Ecosystem Services"),
    value: "public_private_payments_for_ecosystem_services"
  },
  { title: t("Other"), value: "other" }
];
