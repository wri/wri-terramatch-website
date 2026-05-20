import { useT } from "@transifex/react";
import { useMemo } from "react";

export const useContentOverviewTexts = () => {
  const t = useT();

  return useMemo(
    () => ({
      TOTAL_NUMBER_OF_SITES_TOOLTIP: t(
        "Sites are the fundamental unit for reporting data on TerraMatch. They consist of either a single restoration area or a grouping of restoration areas, represented by one or several geospatial polygons."
      ),
      TOTAL_HECTARES_UNDER_RESTORATION_TOOLTIP: t(
        "Total land area measured in hectares with active restoration interventions, tallied by the total area of polygons submitted by projects."
      ),
      MAP_TOOLTIP: t(
        "Click on a country or project to view additional information. Zooming in on the map will display satellite imagery. Those with access to individual project pages can see approved polygons and photos."
      ),
      TARGET_LAND_USE_TYPES_REPRESENTED_TOOLTIP: t(
        "Total hectares under restoration broken down by target land use types."
      ),
      RESTORATION_STRATEGIES_REPRESENTED_TOOLTIP: t(
        "Total hectares under restoration broken down by restoration strategy. Please note that multiple restoration strategies can occur within a single hectare."
      ),
      TERRAFUND_MRV_LINK: t(
        `<a href="https://www.wri.org/update/land-degradation-project-recipe-for-restoration" class="underline !text-black" target="_blank">TerraFund's MRV framework</a>`
      ),
      IMPACT_STORIES_TOOLTIP: t(
        "Impact stories, drawn from narrative reports, site visits, and updates from project managers, give color to the numerical data on the TerraMatch Dashboard. If you are a TerraFund champion and would like to share an impact story, please email our support team at <a href='mailto:info@terramatch.org' class='underline !text-primary'>info@terramatch.org</a>."
      )
    }),
    [t]
  );
};
