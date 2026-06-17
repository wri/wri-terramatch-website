import { useT } from "@transifex/react";

export const useSiteReportKeyIndicatorsContent = () => {
  const t = useT();

  return [
    {
      frameworks: ["terrafund", "terrafund-landscapes", "enterprises", "epa-ghana-pilot", "terrafund-3"],
      treesPlanted: {
        title: t("Trees Planted"),
        content: t("This is the number of trees planted at this site, reported in this reporting period.")
      },
      survivalRate: {
        title: t("Survival Rate"),
        content: t("This is the percentage of planted trees still surviving, reported in this reporting period.")
      },
      treesRegenerated: {
        title: t("Trees Regenerated"),
        content: t(
          "This is the number of trees naturally regenerating at this site, reported in this reporting period."
        )
      }
    },
    {
      frameworks: ["ppc"],
      treesPlanted: {
        title: t("Trees Planted"),
        content: t("This is the number of trees planted at this site this reporting period.")
      },
      directSeeding: {
        title: t("Direct Seeding"),
        content: t("This is the number of trees established through direct seeding this reporting period.")
      },
      treesRegenerating: {
        title: t("Trees Regenerating"),
        content: t("This is the number of trees naturally regenerating at this site this reporting period.")
      },
      workdays: {
        title: t("Workdays"),
        content: t("This is the total workdays created at this site this reporting period.")
      }
    },
    {
      frameworks: ["hbf"],
      treesPlanted: {
        title: t("Trees Planted"),
        content: t("This is the number of trees planted at this site this reporting period.")
      }
    }
  ];
};
