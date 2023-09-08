import { useT } from "@transifex/react";
import { Step } from "react-joyride";

export const tourSelectors = {
  OPPORTUNITIES: "tour-opportunities",
  PROJECTS: "tour-projects",
  ORGANIZATION: "tour-organization",
  HELP: "tour-help"
};

export const getTourItems = (t: typeof useT, isLgDisplay: boolean): Step[] => [
  {
    title: t("Opportunities"),
    content: t("Explore funding opportunities posted by TerraMatch and our partners."),
    target: `.${tourSelectors.OPPORTUNITIES}`,
    disableBeacon: true,
    offset: isLgDisplay ? 60 : 30
  },
  {
    title: t("My Projects"),
    content: t("Manage your project's progress in TerraMatch."),
    target: `.${tourSelectors.PROJECTS}`,
    offset: isLgDisplay ? 60 : 30
  },
  {
    title: t("My Organization"),
    content: t("Update your organizational information and project pitches."),
    target: `.${tourSelectors.ORGANIZATION}`,
    offset: isLgDisplay ? 60 : 30
  },
  {
    title: t("Help Center"),
    content: t("Find guidance and support on using TerraMatch."),
    target: `.${tourSelectors.HELP}`,
    offset: isLgDisplay ? 60 : 30
  }
];
