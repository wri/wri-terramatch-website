/* eslint-disable no-unused-vars */

import { useT } from "@transifex/react";

export const getOrganisationTypeOptions = (t: typeof useT = (t: string) => t) => [
  { title: t("For-Profit Organization"), value: "for-profit-organization" },
  { title: t("Non-Profit Organization"), value: "non-profit-organization" },
  { title: t("Government agency"), value: "government-agency" }
];
