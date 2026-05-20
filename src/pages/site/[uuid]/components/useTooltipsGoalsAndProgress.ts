import { useT } from "@transifex/react";
import { useMemo } from "react";

const useTooltipsGoalsAndProgress = () => {
  const t = useT();

  return useMemo(
    () => ({
      TOOLTIP_HECTARES_RESTORED_PROJECT: t("Number of hectares within approved polygons for this project"),
      TOOLTIP_TREE_RESTORED_PROJECT: t(
        "Number of trees growing for this project (sum of trees planted, seeds planted, and trees regenerating)"
      ),
      TOOLTIP_SAPLING_RESTORED_PROJECT: t(
        "Number of saplings growing for this project (sum of trees planted, seeds planted, and trees regenerating)"
      ),
      TOOLTIP_TREES_PLANTED_PROJECT: t("Number of trees planted for this project"),
      TOOLTIP_SEEDS_PLANTED_PROJECT: t("Number of seeds planted for this project"),
      TOOLTIP_TREES_REGENERATING_PROJECT: t(
        "Number of trees estimated to be naturally regenerating due to this project’s interventions"
      ),
      TOOLTIP_TREES_REPLANTING_PROJECT: t("Number of trees planted as replacements for dead trees for this project"),

      TOOLTIP_HECTARES_RESTORED_SITE: t("Number of hectares within approved polygons for this site"),
      TOOLTIP_TREE_RESTORED_SITE: t(
        "Number of trees growing at this site (sum of trees planted, seeds planted, and trees regenerating)"
      ),
      TOOLTIP_SAPLING_RESTORED_SITE: t(
        "Number of trees growing at this site (sum of trees planted, seeds planted, and trees regenerating)"
      ),
      TOOLTIP_TREES_PLANTED_SITE: t("Number of trees planted at this site"),
      TOOLTIP_SEEDS_PLANTED_SITE: t("Number of seeds planted at this site"),
      TOOLTIP_TREES_REGENERATING_SITE: t(
        "Number of trees estimated to be naturally regenerating due to this project’s interventions at this site"
      ),
      TOOLTIP_TREES_REPLANTING_SITE: t("Number of trees planted as replacements for dead trees at this site")
    }),
    [t]
  );
};

export default useTooltipsGoalsAndProgress;
