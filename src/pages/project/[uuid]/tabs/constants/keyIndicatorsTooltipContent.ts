import { useT } from "@transifex/react";

export const useKeyIndicatorsTooltipContent = () => {
  const t = useT();

  return [
    {
      frameworks: ["terrafund-3"],
      treesRestored: {
        title: t("Trees Planted"),
        content: t("This is the sum of trees planted, as reported by this project across all of this project’s sites.")
      },
      treesRegenerated: {
        title: t("Trees Regenerated"),
        content: t(
          "This is the sum of trees growing due to assisted natural regeneration interventions, as reported by this project across all of this project’s sites."
        )
      },
      saplingsRestored: {
        title: t("Seedlings Grown"),
        content: t(
          "This is the sum of seedlings grown in nurseries, as reported by this project across all of this project’s nurseries."
        )
      },
      treesToBeRestored: {
        title: t("Trees to be restored"),
        content: t(
          "This is the expected number of trees that will be restored through this project. It represents the following calculation: [trees to be planted * expected survival rate] + [trees to be regenerated]."
        )
      },
      hectaresRestored: {
        title: t("Area Restored (ha)"),
        content: t("Number of hectares within approved polygons for this project")
      },
      jobsCreated: {
        title: t("Jobs Created"),
        content: t("This is the sum of part-time and full-time jobs reported created by this project.")
      }
    },
    {
      frameworks: ["terrafund", "terrafund-landscapes", "enterprises", "epa-ghana-pilot"],
      treesRestored: {
        title: t("Trees Planted"),
        content: t("This is the sum of trees planted, as reported by this project across all of this project’s sites.")
      },
      treesRegenerated: {
        title: t("Trees Regenerated"),
        content: t(
          "This is the sum of trees growing due to assisted natural regeneration interventions, as reported by this project across all of this project’s sites."
        )
      },
      saplingsRestored: {
        title: t("Seedlings Grown"),
        content: t(
          "This is the sum of seedlings grown in nurseries, as reported by this project across all of this project’s nurseries."
        )
      },
      treesToBeRestored: {
        title: t("Trees to be restored"),
        content: ""
      },
      hectaresRestored: {
        title: t("Area Restored (ha)"),
        content: t("Number of hectares within approved polygons for this project")
      },
      jobsCreated: {
        title: t("Jobs Created"),
        content: t("This is the sum of part-time and full-time jobs reported created by this project.")
      }
    },
    {
      frameworks: ["hbf"],
      treesRestored: {
        title: t("Saplings Growing"),
        content: t(
          "This is the sum of trees planted, seeds planted, and trees regenerating, as reported by this project across all of this project’s sites."
        )
      },
      treesRegenerated: {
        title: "",
        content: ""
      },
      saplingsRestored: {
        title: "",
        content: ""
      },
      treesToBeRestored: {
        title: "",
        content: ""
      },
      hectaresRestored: {
        title: t("Area Restored (ha)"),
        content: t("Number of hectares within approved polygons for this project")
      },
      jobsCreated: {
        title: t("Jobs Created"),
        content: t("This is the sum of part-time and full-time jobs reported created by this project.")
      }
    },
    {
      frameworks: ["ppc"],
      treesRestored: {
        title: t("Trees Growing"),
        content: t(
          "This is the sum of trees planted, seeds planted, and trees regenerating, as reported by this project across all of this project’s sites."
        )
      },
      treesRegenerated: {
        title: "",
        content: ""
      },
      saplingsRestored: {
        title: "",
        content: ""
      },
      treesToBeRestored: {
        title: "",
        content: ""
      },
      hectaresRestored: {
        title: t("Area Restored (ha)"),
        content: t("Number of hectares within approved polygons for this project")
      },
      jobsCreated: {
        title: t("Workdays Created"),
        content: t("This is the sum of all project- and site-level workdays reported for this project")
      },
      estimatedTreesRestored: {
        title: t("Estimated Trees Restored"),
        content: t(
          "This represents [trees planted * projected planting survival rate] + [seeds planted * projected direct seeding survival rate] + estimated trees growing due to assisted natural regeneration interventions across this project's sites."
        )
      }
    }
  ];
};
