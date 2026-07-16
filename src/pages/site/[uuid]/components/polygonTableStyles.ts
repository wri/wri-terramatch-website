import { getThemedColor } from "@/lib/theme";

const STICKY_COVER_WIDTH = "3.5rem";
export const CHECKBOX_COLUMN_WIDTH = "3rem";

const CHECKBOX_COLUMN_Z_INDEX = {
  header: 12,
  body: 11
} as const;

const POLYGON_NAME_COLUMN_Z_INDEX = {
  header: 10,
  body: 9
} as const;

const STICKY_COLUMN_BASE_STYLES = {
  isolation: "isolate" as const,
  overflow: "visible" as const,
  transform: "translateZ(0)",
  backfaceVisibility: "hidden" as const
};

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

const createStickyCellBackdrop = (backgroundColor: string) => ({
  content: '""',
  position: "absolute" as const,
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor,
  pointerEvents: "none" as const,
  zIndex: 0
});

const createStickyCellLeftInsetCover = (backgroundColor: string) =>
  `inset ${CHECKBOX_COLUMN_WIDTH} 0 0 0 ${backgroundColor}`;

const createStickyCellRightCover = (backgroundColor: string, includeDivider: boolean) => ({
  content: '""',
  position: "absolute" as const,
  top: 0,
  right: `calc(-1 * ${STICKY_COVER_WIDTH})`,
  width: STICKY_COVER_WIDTH,
  height: "100%",
  backgroundColor,
  pointerEvents: "none" as const,
  zIndex: 1,
  ...(includeDivider && {
    boxShadow: `inset -0.063rem 0 0 0 ${getThemedColor("neutral", 400)}`
  })
});

const STICKY_CELL_CONTENT_STYLES = {
  position: "relative" as const,
  zIndex: 2
};

export const getPolygonsTableStyles = (isStickyTableActive: boolean) => {
  const headerBackground = getThemedColor("neutral", 200);
  const bodyBackground = getThemedColor("neutral", 100);
  const hoverBackground = getThemedColor("primary", 100);

  return {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    "& > div > div": {
      overflowX: "auto",
      maxWidth: "100%",
      width: "100%",
      ...(isStickyTableActive && {
        backgroundColor: bodyBackground
      })
    },
    "& table": {
      borderCollapse: "separate",
      borderSpacing: 0
    },
    "& table td": { height: "3rem" },
    "& table th:first-of-type": {
      position: "sticky",
      left: 0,
      zIndex: CHECKBOX_COLUMN_Z_INDEX.header,
      backgroundColor: headerBackground,
      width: CHECKBOX_COLUMN_WIDTH,
      minWidth: CHECKBOX_COLUMN_WIDTH,
      maxWidth: CHECKBOX_COLUMN_WIDTH,
      boxSizing: "border-box",
      ...STICKY_COLUMN_BASE_STYLES,
      boxShadow: createStickyCellLeftInsetCover(headerBackground),
      "&::before": createStickyCellBackdrop(headerBackground),
      "& > *": STICKY_CELL_CONTENT_STYLES
    },
    "& table td:first-of-type": {
      position: "sticky",
      left: 0,
      zIndex: CHECKBOX_COLUMN_Z_INDEX.body,
      backgroundColor: bodyBackground,
      width: CHECKBOX_COLUMN_WIDTH,
      minWidth: CHECKBOX_COLUMN_WIDTH,
      maxWidth: CHECKBOX_COLUMN_WIDTH,
      boxSizing: "border-box",
      transition: "background-color 0.15s ease-in-out",
      ...STICKY_COLUMN_BASE_STYLES,
      boxShadow: createStickyCellLeftInsetCover(bodyBackground),
      "&::before": createStickyCellBackdrop(bodyBackground),
      "& > *": STICKY_CELL_CONTENT_STYLES
    },
    "& table th:nth-of-type(2)": {
      position: "sticky",
      left: CHECKBOX_COLUMN_WIDTH,
      zIndex: POLYGON_NAME_COLUMN_Z_INDEX.header,
      backgroundColor: headerBackground,
      padding: 0,
      ...STICKY_COLUMN_BASE_STYLES,
      "&::before": createStickyCellBackdrop(headerBackground),
      "&::after": createStickyCellRightCover(headerBackground, isStickyTableActive),
      "& > *": STICKY_CELL_CONTENT_STYLES
    },
    "& table td:nth-of-type(2)": {
      position: "sticky",
      left: CHECKBOX_COLUMN_WIDTH,
      zIndex: POLYGON_NAME_COLUMN_Z_INDEX.body,
      backgroundColor: bodyBackground,
      padding: 0,
      transition: "background-color 0.15s ease-in-out",
      ...STICKY_COLUMN_BASE_STYLES,
      "&::before": createStickyCellBackdrop(bodyBackground),
      "&::after": createStickyCellRightCover(bodyBackground, isStickyTableActive),
      "& > *": STICKY_CELL_CONTENT_STYLES
    },
    "& table tbody tr:hover td:nth-of-type(2), & table tbody tr:hover td:first-of-type, & table tbody tr[aria-selected='true'] td:nth-of-type(2), & table tbody tr[aria-selected='true'] td:first-of-type":
      {
        backgroundColor: hoverBackground
      },
    "& table tbody tr:hover td:first-of-type::before, & table tbody tr[aria-selected='true'] td:first-of-type::before":
      {
        backgroundColor: hoverBackground
      },
    "& table tbody tr:hover td:first-of-type, & table tbody tr[aria-selected='true'] td:first-of-type": {
      boxShadow: createStickyCellLeftInsetCover(hoverBackground)
    },
    "& table tbody tr:hover td:nth-of-type(2)::before, & table tbody tr[aria-selected='true'] td:nth-of-type(2)::before, & table tbody tr:hover td:nth-of-type(2)::after, & table tbody tr[aria-selected='true'] td:nth-of-type(2)::after":
      {
        backgroundColor: hoverBackground
      },
    "& table th:nth-of-type(2) > div, & table td:nth-of-type(2) > div": {
      position: "relative",
      zIndex: 2,
      padding: "0.75rem",
      display: "flex",
      alignItems: "center",
      height: "100%"
    },

    "& table th:nth-of-type(2), & table td:nth-of-type(2)": {
      minWidth: "17.75rem",
      maxWidth: "17.75rem"
    },
    "& table th:nth-of-type(3), & table td:nth-of-type(3)": {
      minWidth: "15.875rem",
      maxWidth: "15.875rem"
    },
    "& table th:nth-of-type(4), & table td:nth-of-type(4)": {
      minWidth: "12.75rem",
      maxWidth: "12.75rem"
    },
    "& table th:nth-of-type(5), & table td:nth-of-type(5)": {
      minWidth: "15.5rem",
      maxWidth: "15.5rem"
    },
    "& table th:nth-of-type(6), & table td:nth-of-type(6)": {
      minWidth: "16.75rem",
      maxWidth: "16.75rem"
    },
    "& table th:nth-of-type(7), & table td:nth-of-type(7)": {
      minWidth: "15.875rem",
      maxWidth: "15.875rem"
    },
    "& table th:nth-of-type(8), & table td:nth-of-type(8)": {
      minWidth: "12.5rem",
      maxWidth: "12.5rem"
    },
    "& table th:nth-of-type(9), & table td:nth-of-type(9)": {
      minWidth: "12.75rem",
      maxWidth: "12.75rem"
    },
    "& table th:nth-of-type(10), & table td:nth-of-type(10)": {
      minWidth: "15.75rem",
      maxWidth: "15.75rem"
    },
    "& table th:nth-of-type(11), & table td:nth-of-type(11)": {
      minWidth: "12rem",
      maxWidth: "12rem"
    }
  };
};
