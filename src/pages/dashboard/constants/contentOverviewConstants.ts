/** Mobile layout breakpoint aligned with existing dashboard map usage. */
export const DASHBOARD_MOBILE_MEDIA_QUERY = "(max-width: 1200px)";

/** Longitude bounds for syncing map center state (Web Mercator safe clamp). */
export const MAP_MIN_LONGITUDE = -180;
export const MAP_MAX_LONGITUDE = 180;

/** Latitude bounds for syncing map center state. */
export const MAP_MIN_LATITUDE = -90;
export const MAP_MAX_LATITUDE = 90;

export const MODAL_EXPAND_ID = "modalExpand" as const;

export const MODAL_TABLE_PAGE_SIZE = 10;

export const VISIBLE_TABLE_ROWS_ON_DASHBOARD = 50;

export const TOTAL_NUMBER_OF_SITES_TOOLTIP =
  "Sites are the fundamental unit for reporting data on TerraMatch. They consist of either a single restoration area or a grouping of restoration areas, represented by one or several geospatial polygons.";

export const TOTAL_HECTARES_UNDER_RESTORATION_TOOLTIP =
  "Total land area measured in hectares with active restoration interventions, tallied by the total area of polygons submitted by projects.";

export const MAP_TOOLTIP =
  "Click on a country or project to view additional information. Zooming in on the map will display satellite imagery. Those with access to individual project pages can see approved polygons and photos.";

export const TARGET_LAND_USE_TYPES_REPRESENTED_TOOLTIP =
  "Total hectares under restoration broken down by target land use types.";

export const RESTORATION_STRATEGIES_REPRESENTED_TOOLTIP =
  "Total hectares under restoration broken down by restoration strategy. Please note that multiple restoration strategies can occur within a single hectare.";

export const TERRAFUND_MONITORING_LINK = "https://www.wri.org/update/land-degradation-project-recipe-for-restoration";

export const TERRAFUND_MRV_LINK = `<a href=${TERRAFUND_MONITORING_LINK} class="underline !text-black" target="_blank">TerraFund's MRV framework</a>`;

export const IMPACT_STORIES_TOOLTIP =
  "Impact stories, drawn from narrative reports, site visits, and updates from project managers, give color to the numerical data on the TerraMatch Dashboard. If you are a TerraFund champion and would like to share an impact story, please email our support team at <a href='mailto:info@terramatch.org' class='underline !text-primary'>info@terramatch.org</a>.";
