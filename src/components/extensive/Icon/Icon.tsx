import { CSSProperties, FC, useEffect, useState } from "react";
import { Else, If, Then } from "react-if";
import SVG from "react-inlinesvg";

/* eslint-disable no-unused-vars */
export enum IconNames {
  PLUS = "plus",
  PLUS_THICK = "plus-thick",
  CHEVRON_RIGHT = "chevron-right",
  CHEVRON_RIGHT_SMALL = "chevron-right-small",
  CHEVRON_LEFT = "chevron-left",
  CHEVRON_LEFT_CIRCLE = "chevron-left-circle",
  CHEVRON_DOWN = "chevron-down",
  CHECK_PROGRESSBAR = "check-progressbar",
  CROSS = "cross",
  CROSS_CIRCLE = "cross-circle",
  CLOCK = "clock",
  FACEBOOK = "facebook",
  TRIANGLE_DOWN = "triangle-down",
  EARTH = "earth",
  X_CIRCLE = "x-circle",
  WRI_LOGO = "wri-logo",
  LOGIN = "login",
  LINK = "link",
  PROFILE = "profile",
  MENU = "menu",
  TREE = "tree",
  LOGOUT = "logout",
  IC_SWITCH = "ic-switch",
  MAIL_OPEN = "mail-open",
  MAIL_SENT = "mail-sent",
  CHECK_CIRCLE = "check-circle",
  CHECK_CIRCLE_GREEN = "check-circle-green",
  TICK_RECT = "tick-rect",
  UPLOAD = "upload",
  DOCUMENT = "document",
  TRASH = "trash",
  TRASH_CIRCLE = "trash-circle",
  MAP_PIN = "map-pin",
  SOCIAL_FACEBOOK = "social/facebook",
  SOCIAL_LINKEDIN = "social/linkedin",
  SOCIAL_INSTAGRAM = "social/instagram",
  SOCIAL_TWITTER = "social/twitter",
  SOCIAL_WEB = "social/web",
  SORT = "sort",
  SORT_UP = "sort-up",
  SORT_DOWN = "sort-down",
  SEARCH = "search",
  CALENDAR = "calendar",
  BRANCH_CIRCLE = "branch-circle",
  LIGHT_BULB_CIRCLE = "light-bulb-circle",
  LINKEDIN = "linkedin",
  TWITTER = "twitter",
  INFO_CIRCLE = "info-circle",
  INFO_CIRCLE_ALT = "info-circle-alt",
  INSTAGRAM = "instagram",
  USER_CIRCLE = "user-circle",
  TREE_CIRCLE = "tree-circle",
  TREE_CIRCLE_PD = "tree-circle-pd",
  DOCUMENT_CIRCLE = "document-circle",
  DOWNLOAD = "download",
  DOWNLOAD_CUSTOM = "download-custom",
  DOWNLOAD_CIRCLE = "download-circle",
  SPINNER = "spinner",
  ERROR = "error",
  MINUS_CIRCLE = "minus-circle",
  LAPTOP_CIRCLE = "laptop-circle",
  ARROW_SPIN_CIRCLE = "arrow-spin-circle",
  CHECK_CIRCLE_FILL = "check-circle-fill",
  DOTS_CIRCLE_FILL = "dots-circle-fill",
  EXCLAMATION_CIRCLE_FILL = "exclamation-circle-fill",
  EXCLAMATION_CIRCLE = "exclamation-circle",
  EDIT_CIRCLE = "edit-circle",
  CLOCK_CIRCLE = "clock-circle",
  STATUS_APPROVED = "status/approved",
  STATUS_REJECTED = "status/rejected",
  STATUS_DRAFT = "status/draft",
  STATUS_MORE_INFO = "status/more-info-required",
  STATUS_AWAITING_REVIEW = "status/awaiting-review",
  ROUND_RED_CROSS = "round-red-cross",
  ROUND_GREEN_TICK = "round-green-tick",
  ROUND_CUSTOM_TICK = "round-custom-tick",
  WARNING = "warning",
  IMAGE_PLACEHOLDER = "image-placeholder",
  ZoomIn = "zoom-in",
  ZoomOut = "zoom-out",
  DrawPolygon = "draw-polygon",
  DrawPoint = "draw-point",
  DrawCircle = "draw-circle",
  DragCircle = "drag-circle",
  LOCK_CIRCLE = "lock-circle",
  MAP_THUMBNAIL = "map-thumbnail",
  LEAF_CIRCLE = "leaf-circle",
  LEAF_CIRCLE_PD = "leaf-circle_pd",
  REFRESH_CIRCLE = "refresh-circle",
  REFRESH_CIRCLE_PD = "refresh-circle_pd",
  SITE_CIRCLE = "site-circle",
  NURSERY_CIRCLE = "nursery-circle",
  SUCCESS = "ic-success",
  CRITICAL = "ic-critical",
  USER_ROLE = "user-role",
  USER_PROJECT_DEVELOPER = "ic-projectdeveloper",
  USER_GOVERNMENT = "ic-government",
  USER_INVESTOR = "ic-investor",
  NO_SUCCESS = "no-success",
  CLEAR = "clear",
  CLEAR_DASHBOARD = "clear-dashboard",
  IC_ERROR = "ic-error",
  IC_ERROR_PANEL = "ic-error-panel",
  IC_WARNING = "ic-warning",
  IC_SUCCESS = "ic-success",
  FILTER = "filter",
  ELIPSES = "elipses",
  AIRTABLE = "airtable",
  REPORTS = "reports",
  NURSERIES = "nurseries",
  SITES = "sites",
  PROJECTS = "projects",
  FORMS = "forms",
  APPLICATIONS = "applications",
  REPORTING_FRAMEWORKS = "reporting-frameworks",
  FUNDING_PROGRAMMES = "funding-programmes",
  PITCHES = "pitches",
  ORGANISATIONS = "organisations",
  USERS = "users",
  CHEVRON_LEFT_PA = "chevron-left-pa",
  TRASH_PA = "trash-pa",
  EDIT = "edit",
  PLUS_PA = "plus-pa",
  DOWNLOAD_PA = "download-pa",
  UPLOAD_PA = "upload-pa",
  PLUS_CIRCLE = "plus-circle",
  PLUS_CIRCLE_CUSTOM = "plus-circle-custom",
  POLYGON = "polygon",
  SEARCH_PA = "search-pa",
  SEND = "send",
  LINK_PA = "link-pa",
  REQUEST = "request",
  COMMENT = "comment",
  CHEVRON_DOWN_PA = "chevron-down-pa",
  CHEVRON_DOWN_DASH = "chevron-down-dash",
  FRAMEWORK_PROGRAMME = "framework-programme",
  PAPER_CLIP = "paper-clip",
  CHECK_PROGRESSBAR_NULL = "check-progressbar-null",
  UPLOAD_CLOUD = "upload-cloud",
  UPLOAD_CLOUD_CUSTOM = "upload-cloud-custom",
  CHECK_POLYGON = "check-polygon",
  ELLIPSE_POLYGON = "ellipse-polygon",
  LEAF = "leaf",
  IC_INFO = "ic-info",
  GRAPH1 = "graph-1",
  GRAPH2 = "graph-2",
  GRAPH3 = "graph-3",
  GRAPH4 = "graph-4",
  GRAPH5 = "graph-5",
  IC_MORE_OUTLINED = "ic-more-outlined",
  IC_SITE_VIEW = "ic-site-view",
  IC_EARTH_MAP = "earth-map",
  IC_DOWNLOAD_MENU = "download-menu",
  IC_FILTER = "ic-filter",
  IC_SORT = "ic-sort",
  APPROVED_COLORLESS = "status/approved-colorless",
  IMAGE = "image",
  IC_INFO_WHITE = "ic-info-white",
  ERROR_WHITE_BORDER_RED = "error-white-border-red",
  CLICK = "click",
  IC_APPROVED = "ic_approved",
  IC_DRAFT = "ic_draft",
  IC_NEEDS_MORE_INFORMATION = "ic_needs-more-information",
  IC_SUBMITTED = "ic_submitted",
  IC_ARROW_COLLAPSE = "ic-arrow-collapse",
  IMAGE_ICON = "image-icon",
  DOCUMENT_CIRCLE_HOMEPAGE = "document-circle-home",
  TREE_CIRCLE_HOMEPAGE = "tree-circle-home",
  IC_A_TO_Z_CUSTOM = "ic-a-to-z-custom",
  IC_Z_TO_A_CUSTOM = "ic-z-to-a-custom",
  TERRAFUND_lOGO_MINI = "ic-terrafund-mini",
  DASHBOARDS = "dashboards",
  PROJECT_PROFILE = "project-profile",
  DASHBOARD_AIRTABLE = "dashboard-airtable",
  DASHBOARD_REPORTS = "dashboard-reports",
  DASHBOARD_IMPACT_STORY = "dashboard-impact-story",
  ABOUT_US = "about-us",
  EXPAND = "expand",
  COLLAPSE = "collapse",
  IC_AGROFOREST = "targetLand/Agroforest",
  IC_NATURAL_FOREST = "targetLand/NaturalForest",
  IC_MANGROVE = "targetLand/Mangrove",
  IC_WOODLOT = "targetLand/Woodlot",
  IC_OPEN_NATURAL_ECOSYSTEM = "targetLand/OpenNaturalEcosystem",
  IC_RIPARIAN_AREA = "targetLand/RiparianArea",
  IC_URBAN_FOREST = "targetLand/UrbanForest",
  IC_SILVOPASTURE = "targetLand/Silvopasture",
  IC_PEATLAND = "targetLand/Peatland",
  IC_LEGEND_MAP = "ic-legend-map",
  EDIT_PA = "edit-pa",
  PIN = "pin",
  LINK_AIRTABLE = "link-aritable",
  IC_USER = "ic-user",
  MY_ACCOUNT = "my-account",
  MONITORING_PROFILE = "monitoring-profile",
  DASHBOARD = "dashboard",
  RUN_ALALYSIS = "run-analysis",
  MAP = "map",
  TABLE = "table",
  REQUEST_ACCOUNT = "request-account",
  PRE_FILTERED_PAGE = "pre-filtered-page",
  VISIT_DASHBOARD = "visit-dashboard",
  ORANGE_DOTS = "orange-dots",
  IC_NOTIFICATION = "notification",
  IC_LOADING = "loading",
  IC_INFO_WHITE_BLACK = "ic-info-white-black",
  FLOAT_NOTIFICATION = "float-notification",
  IC_EXPAND = "ic_expand",
  IC_SHINK = "ic_shrink",
  IC_ADD_BUTTON = "add-button",
  TRASH_TA = "trash-ta",
  EDIT_TA = "edit-ta",
  NON_SCIENTIFIC_NAME = "non-scientific name",
  NEW_TAG_TREE_SPECIES = "new-tag-tree-species",
  NON_SCIENTIFIC_NAME_CUSTOM = "non-scientific name custom",
  TREE_DASHABOARD = "tree-dashboard",
  ASSISTED_NATURAL_REGENERATION = "assisted-natural-regeneration",
  NATIVE_SPECIES = "native-species",
  NEW_TAG_TREE_SPECIES_CUSTOM = "new-tag-tree-species-custom",
  SURVIVAL_RATE = "survival-rate",
  LEAF_PLANTED_CIRCLE = "leaf-planted-circle_pd",
  LEARF_NATIVE_CIRCLE_PD = "leaf-native-circle_pd",
  NON_TREES_PLANTED_CIRCLE = "non-trees-planted-circle",
  SEED_PLANTED = "seed-planted",
  TREES_REGENERATING = "trees-regenerating",
  NON_TRESS_PLANTED = "non-trees-planted",
  ARROW_UP_RIGHT = "arrow-up-right",
  SHARE_IMPACT_STORY = "share-impact-story",
  BRIEFCASE = "briefcase",
  EARTH_DASHBOARD = "earth-dashboard",
  CHECK = "check",
  IC_MENU = "ic-menu",
  CHECK_LANGUAGES = "check-laguages",
  NO_CHECK_LANGUAGES = "no-check-laguages",
  ARROW = "arrow"
}

export interface IconProps {
  name: IconNames;
  className?: string;
  width?: number;
  height?: number;
  style?: CSSProperties;
  viewBox?: string;
}

const Icon: FC<IconProps> = ({ name, width = 24, height, className = "", style = {}, viewBox }) => {
  const [path, setPath] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);

  // Imports the SVG
  useEffect(() => {
    const importIcon = async () => {
      setLoading(true);
      setPath((await import(`../../../assets/icons/${name}.svg`)).default);
      setLoading(false);
    };

    importIcon();
    // eslint-disable-next-line
  }, [name]);

  const svgProps = { width, height: height ?? width, className, style };
  // If the viewBox property key exists at all, even with undefined, it overrides the default behavior
  // of pulling in the viewbox from the src SVG file.
  if (viewBox != null) {
    // @ts-ignore
    svgProps.viewBox = viewBox;
  }

  return (
    <If condition={!loading}>
      <Then>
        <SVG src={path ?? ""} {...svgProps} />
      </Then>
      <Else>
        <div style={{ width, height, ...style }} />
      </Else>
    </If>
  );
};

export default Icon;
