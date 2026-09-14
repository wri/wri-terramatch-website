import { resolveRemSizeValue } from "@/lib/sizing";

export const SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS = 100;
export const SITE_POLYGON_MAP_INITIAL_HEIGHT = resolveRemSizeValue(SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS);
export const SITE_POLYGON_TAB_HEADER_ID = "site-polygon-tab-header";
// Scroll-margin offset applied to the polygon/site tab header so it clears the sticky chrome when
// scrolled into view. Shared by the flat and rollup review views to keep the offset identical.
export const SITE_POLYGON_TAB_SCROLL_MARGIN_CLASS = "scroll-mt-[5.5rem]";
