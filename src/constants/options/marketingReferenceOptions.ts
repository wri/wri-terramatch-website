import { useT } from "@transifex/react";

export const getMarketingReferenceOptions = (t: typeof useT = (t: string) => t) => [
  {
    value: "land-accelerator",
    title: t("Land Accelerator")
  },
  {
    value: "afr100-partner",
    title: t("AFR100 Partner")
  },
  {
    value: "whatsapp",
    title: t("WhatsApp")
  },
  {
    value: "linkedin",
    title: t("LinkedIn")
  },
  {
    value: "funding-partner",
    title: t("Funding Partner")
  },
  {
    value: "facebook",
    title: t("Facebook")
  },
  {
    value: "twitter",
    title: t("Twitter")
  },
  {
    value: "world-resources-institute",
    title: t("World Resources Institute")
  },
  {
    value: "one-tree-planted",
    title: t("One Tree Planted")
  },
  {
    value: "realize-impact",
    title: t("Realize Impact")
  },
  {
    value: "barka-fund",
    title: t("Barka Fund")
  },
  {
    value: "government-agency",
    title: t("Government Agency")
  },
  {
    value: "grant-opportunity-website",
    title: t("Grant opportunity website")
  },
  {
    value: "internet-search",
    title: t("Internet search")
  },
  {
    value: "email",
    title: t("Email")
  },
  {
    value: "other",
    title: t("Other")
  }
];
