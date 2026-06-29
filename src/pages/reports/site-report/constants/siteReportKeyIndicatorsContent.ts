import { useT } from "@transifex/react";

export const useSiteReportKeyIndicatorsContent = () => {
  const t = useT();

  return {
    terrafund: {
      treesPlanted: {
        title: t("Trees Planted"),
        tooltip: t("This is the number of trees planted at this site, reported in this reporting period.")
      },
      survivalRate: {
        title: t("Survival Rate"),
        tooltip: t("This is the percentage of planted trees still surviving, reported in this reporting period.")
      },
      treesRegenerated: {
        title: t("Trees Regenerated"),
        tooltip: t(
          "This is the number of trees naturally regenerating at this site, reported in this reporting period."
        )
      }
    },
    ppc: {
      treesPlanted: {
        title: t("Trees Planted"),
        tooltip: t("This is the number of trees planted at this site this reporting period.")
      },
      directSeeding: {
        title: t("Direct Seeding"),
        tooltip: t("This is the number of trees established through direct seeding this reporting period.")
      },
      treesRegenerating: {
        title: t("Trees Regenerating"),
        tooltip: t("This is the number of trees naturally regenerating at this site this reporting period.")
      },
      workdays: {
        title: t("Workdays"),
        tooltip: t("This is the total workdays created at this site this reporting period.")
      }
    },
    hbf: {
      treesPlanted: {
        title: t("Trees Planted"),
        tooltip: t("This is the number of trees planted at this site this reporting period.")
      }
    }
  };
};
