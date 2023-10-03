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
  CROSS = "cross",
  CLOCK = "clock",
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
  CALENDAR = "calendar",
  BRANCH_CIRCLE = "branch-circle",
  LIGHT_BULB_CIRCLE = "light-bulb-circle",
  INFO_CIRCLE = "info-circle",
  INFO_CIRCLE_ALT = "info-circle-alt",
  USER_CIRCLE = "user-circle",
  TREE_CIRCLE = "tree-circle",
  DOCUMENT_CIRCLE = "document-circle",
  DOWNLOAD = "download",
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
  WARNING = "warning"
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
