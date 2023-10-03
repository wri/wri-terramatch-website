import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getCapacityBuildingNeedOptions = (t: typeof useT = (t: string) => t): Option[] => [
  {
    value: "site-selection",
    title: t("Site Selection")
  },
  {
    value: "nursery-management",
    title: t("Nursery Management")
  },
  {
    value: "species",
    title: t("Species")
  },
  {
    value: "community-engagement",
    title: t("Community Engagement")
  },
  {
    value: "narrative",
    title: t("Narrative")
  },
  {
    value: "field-monitoring",
    title: t("Field Monitoring")
  },
  {
    value: "remote-sensing",
    title: t("Remote Sensing")
  },
  {
    value: "accounting",
    title: t("Accounting")
  },
  {
    value: "proposal",
    title: t("Proposal")
  },
  {
    value: "government",
    title: t("Government")
  },
  {
    value: "certifications",
    title: t("Certifications")
  },
  {
    value: "communications",
    title: t("Communications")
  },
  {
    value: "social-equity",
    title: t("Social Equity")
  },
  {
    value: "supply-chain-development",
    title: t("Supply Chain Development")
  },
  {
    value: "product-marketing",
    title: t("Product Marketing")
  }
];
