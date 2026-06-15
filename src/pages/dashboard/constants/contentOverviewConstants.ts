import { TERRAFUND_MONITORING_LINK, TERRAFUND_MRV_LINK } from "@/constants/dashboardConsts";

/** Mobile layout breakpoint aligned with existing dashboard map usage. */
export const DASHBOARD_MOBILE_MEDIA_QUERY = "(max-width: 1200px)";

export { TERRAFUND_MRV_LINK, TERRAFUND_MONITORING_LINK };

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
  "The total area where active restoration interventions are being implemented, tallied by the total area of polygons submitted by projects and approved by GIS Associates.";

export const MAP_TOOLTIP =
  "Click on a country or project to view additional information. Zooming in on the map will display satellite imagery. Those with access to individual project pages can see approved polygons and photos.";

export const TARGET_LAND_USE_TYPES_REPRESENTED_TOOLTIP =
  "Hectares under restoration broken down by target land use types. Please refer to the link in the description above for detailed definitions.";

export const RESTORATION_STRATEGIES_REPRESENTED_TOOLTIP =
  "Hectares under restoration broken down by restoration strategy. Please note that multiple restoration strategies can occur within a single hectare. Please refer to the link in the description above for detailed definitions.";

export const IMPACT_STORIES_TOOLTIP =
  "Impact stories, drawn from narrative reports, site visits, and updates from project managers, give color to the numerical data on the TerraMatch Dashboard. If you are a TerraFund champion and would like to share an impact story, please email our support team at <a href='mailto:info@terramatch.org' class='underline !text-primary'>info@terramatch.org</a>.";
