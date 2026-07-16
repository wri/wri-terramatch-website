import { getThemedColor } from "@/lib/theme";

const STICKY_COVER_WIDTH = "1rem";

const CHECKBOX_COLUMN_Z_INDEX = {
  header: 12,
  body: 11
} as const;

const POLYGON_NAME_COLUMN_Z_INDEX = {
  header: 10,
  body: 9
} as const;

type StickyCoverOptions = {
  leftCover?: boolean;
  rightCover?: boolean;
  divider?: boolean;
};

export const buildStickyCoverShadow = (backgroundColor: string, options: StickyCoverOptions = {}): string => {
  const shadows: string[] = [];

  if (options.leftCover) {
    shadows.push(`-${STICKY_COVER_WIDTH} 0 0 0 ${backgroundColor}`);
  }

  if (options.rightCover) {
    shadows.push(`${STICKY_COVER_WIDTH} 0 0 0 ${backgroundColor}`);
  }

  if (options.divider) {
    shadows.push(`inset -0.063rem 0 0 0 ${getThemedColor("neutral", 400)}`);
  }

  return shadows.join(", ");
};

export const getPolygonsTableStyles = (isStickyTableActive: boolean) => {
  const headerBackground = getThemedColor("neutral", 200);
  const bodyBackground = getThemedColor("neutral", 100);
  const hoverBackground = getThemedColor("primary", 100);

  const checkboxHeaderShadow = isStickyTableActive
    ? buildStickyCoverShadow(headerBackground, { leftCover: true, rightCover: true })
    : undefined;

  const checkboxBodyShadow = isStickyTableActive
    ? buildStickyCoverShadow(bodyBackground, { leftCover: true, rightCover: true })
    : undefined;

  const polygonNameHeaderShadow = isStickyTableActive
    ? buildStickyCoverShadow(headerBackground, { rightCover: true, divider: true })
    : undefined;

  const polygonNameBodyShadow = isStickyTableActive
    ? buildStickyCoverShadow(bodyBackground, { rightCover: true, divider: true })
    : undefined;

  const checkboxHoverShadow = isStickyTableActive
    ? buildStickyCoverShadow(hoverBackground, { leftCover: true, rightCover: true })
    : undefined;

  const polygonNameHoverShadow = isStickyTableActive
    ? buildStickyCoverShadow(hoverBackground, { rightCover: true, divider: true })
    : undefined;

  return {
    ...(isStickyTableActive && {
      "& > div > div": {
        backgroundColor: bodyBackground
      }
    }),
    "& table td": { height: "3rem" },
    "& table th:first-of-type": {
      position: "sticky",
      left: 0,
      zIndex: CHECKBOX_COLUMN_Z_INDEX.header,
      backgroundColor: headerBackground,
      isolation: "isolate",
      ...(checkboxHeaderShadow != null && { boxShadow: checkboxHeaderShadow })
    },
    "& table td:first-of-type": {
      position: "sticky",
      left: 0,
      zIndex: CHECKBOX_COLUMN_Z_INDEX.body,
      backgroundColor: bodyBackground,
      isolation: "isolate",
      transition: "background-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
      ...(checkboxBodyShadow != null && { boxShadow: checkboxBodyShadow })
    },
    "& table th:nth-of-type(2)": {
      position: "sticky",
      left: "3rem",
      zIndex: POLYGON_NAME_COLUMN_Z_INDEX.header,
      backgroundColor: headerBackground,
      padding: 0,
      isolation: "isolate",
      ...(polygonNameHeaderShadow != null && { boxShadow: polygonNameHeaderShadow })
    },
    "& table td:nth-of-type(2)": {
      position: "sticky",
      left: "3rem",
      zIndex: POLYGON_NAME_COLUMN_Z_INDEX.body,
      backgroundColor: bodyBackground,
      padding: 0,
      isolation: "isolate",
      transition: "background-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
      ...(polygonNameBodyShadow != null && { boxShadow: polygonNameBodyShadow })
    },
    "& table tbody tr:hover td:nth-of-type(2), & table tbody tr:hover td:first-of-type, & table tbody tr[aria-selected='true'] td:nth-of-type(2), & table tbody tr[aria-selected='true'] td:first-of-type":
      {
        backgroundColor: hoverBackground
      },
    ...(isStickyTableActive && {
      "& table tbody tr:hover td:first-of-type, & table tbody tr[aria-selected='true'] td:first-of-type": {
        boxShadow: checkboxHoverShadow
      },
      "& table tbody tr:hover td:nth-of-type(2), & table tbody tr[aria-selected='true'] td:nth-of-type(2)": {
        boxShadow: polygonNameHoverShadow
      }
    }),
    "& table th:nth-of-type(2) > div, & table td:nth-of-type(2) div": {
      position: "relative",
      padding: "0.75rem",
      display: "flex",
      alignItems: "center",
      height: "100%"
    }
  };
};
