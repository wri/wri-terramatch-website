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
  LINKEDLIN = "linkedin",
  INFO_CIRCLE = "info-circle",
  INFO_CIRCLE_ALT = "info-circle-alt",
  INSTAGRAM = "instagram",
  USER_CIRCLE = "user-circle",
  TREE_CIRCLE = "tree-circle",
  DOCUMENT_CIRCLE = "document-circle",
  DOWNLOAD = "download",
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
  REFRESH_CIRCLE = "refresh-circle",
  SITE_CIRCLE = "site-circle",
  NURSERY_CIRCLE = "nursery-circle",
  CLEAR = "clear",
  IC_ERROR = "ic-error",
  IC_WARNING = "ic-warning",
  IC_SUCCESS = "ic-success"
}

export interface IconProps {
  name: IconNames;
  className?: string;
  width?: number;
  height?: number;
  style?: CSSProperties;
}

const Icon: FC<IconProps> = ({ name, width = 24, height, className = "", style = {} }) => {
  const [path, setPath] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);

  // Imports the SVG
  useEffect(() => {
    const importIcon = async () => {
      setPath((await import(`../../../assets/icons/${name}.svg`)).default);
    };

    setLoading(true);
    importIcon();
    setLoading(false);
    // eslint-disable-next-line
  }, [name]);

  return (
    <If condition={!loading}>
      <Then>
        <SVG src={path ?? ""} width={width} height={height || width} className={className} style={style} />
      </Then>
      <Else>
        <div style={{ width, height, ...style }} />
      </Else>
    </If>
  );
};

export default Icon;
