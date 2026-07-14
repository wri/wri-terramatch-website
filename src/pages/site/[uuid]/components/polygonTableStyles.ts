import { getThemedColor } from "@/lib/theme";

const CHECKBOX_COLUMN_Z_INDEX = {
  header: 4,
  body: 3
} as const;

const POLYGON_NAME_COLUMN_Z_INDEX = {
  header: 3,
  body: 2
} as const;

export const getPolygonsTableStyles = (isStickyTableActive: boolean) => ({
  "& table td": { height: "3rem" },
  "& table th:first-of-type": {
    position: "sticky",
    left: 0,
    zIndex: CHECKBOX_COLUMN_Z_INDEX.header,
    backgroundColor: getThemedColor("neutral", 200),
    overflow: "hidden",
    ...(isStickyTableActive && {
      boxShadow: `-0.25rem 0 0 0 ${getThemedColor("neutral", 200)}`
    })
  },
  "& table td:first-of-type": {
    position: "sticky",
    left: 0,
    zIndex: CHECKBOX_COLUMN_Z_INDEX.body,
    backgroundColor: getThemedColor("neutral", 100),
    overflow: "hidden",
    transition: "background-color 0.15s ease-in-out",
    ...(isStickyTableActive && {
      boxShadow: `-0.25rem 0 0 0 ${getThemedColor("neutral", 100)}`
    })
  },
  "& table th:nth-of-type(2)": {
    position: "sticky",
    left: "3rem",
    zIndex: POLYGON_NAME_COLUMN_Z_INDEX.header,
    backgroundColor: getThemedColor("neutral", 200),
    padding: 0,
    overflow: "hidden"
  },
  "& table td:nth-of-type(2)": {
    position: "sticky",
    left: "3rem",
    zIndex: POLYGON_NAME_COLUMN_Z_INDEX.body,
    backgroundColor: getThemedColor("neutral", 100),
    padding: 0,
    overflow: "hidden",
    transition: "background-color 0.15s ease-in-out"
  },
  "& table tbody tr:hover td:nth-of-type(2), & table tbody tr:hover td:first-of-type, & table tbody tr[aria-selected='true'] td:nth-of-type(2), & table tbody tr[aria-selected='true'] td:first-of-type":
    {
      backgroundColor: getThemedColor("primary", 100)
    },
  ...(isStickyTableActive && {
    "& table tbody tr:hover td:first-of-type, & table tbody tr[aria-selected='true'] td:first-of-type": {
      boxShadow: `-0.25rem 0 0 0 ${getThemedColor("primary", 100)}`
    }
  }),
  "& table th:nth-of-type(2) > div, & table td:nth-of-type(2) div": {
    position: "relative",
    padding: "0.75rem",
    display: "flex",
    alignItems: "center",
    height: "100%"
  },

  "& table th:nth-of-type(2), & table td:nth-of-type(2)": {
    minWidth: "17.75rem",
    maxWidth: "17.75rem",
    ...(isStickyTableActive && {
      boxShadow: `inset -0.063rem 0 0 0 ${getThemedColor("neutral", 400)}`
    })
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
    minWidth: "11.5rem",
    maxWidth: "11.5rem"
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
});
