import { useT } from "@transifex/react";

export const useProjectReportKeyIndicatorsContent = () => {
  const t = useT();

  return {
    terrafund: {
      treesPlanted: {
        title: t("Trees Planted"),
        tooltip: t(
          "This is the sum of trees planted, direct seeded, and naturally regenerating in this reporting period, added up across your site reports."
        )
      },
      treesRegenerated: {
        title: t("Trees Regenerated"),
        tooltip: t("This is the number of trees naturally regenerating, reported in this reporting period.")
      },
      jobsCreated: {
        title: t("Jobs Created"),
        tooltip: t("This is the number of jobs created, reported in this report.")
      }
    },
    ppc: {
      treesGrowing: {
        title: t("Trees Growing"),
        tooltip: t(
          "This is the sum of trees planted, direct seeded, and naturally regenerating this reporting period, added up across your site reports."
        )
      },
      workdaysCreated: {
        title: t("Workdays Created"),
        tooltip: t("This is the total workdays created this reporting period.")
      }
    },
    hbf: {
      saplingsGrowing: {
        title: t("Saplings Growing"),
        tooltip: t(
          "This is the sum of saplings planted, direct seeded, and naturally regenerating this reporting period."
        )
      },
      workdaysCreated: {
        title: t("Workdays Created"),
        tooltip: t("This is the total direct workdays reported for this reporting period.")
      }
    }
  };
};
