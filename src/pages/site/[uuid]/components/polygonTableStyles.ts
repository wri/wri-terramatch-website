import { getThemedColor } from "@/lib/theme";

export const getPolygonsTableStyles = (isStickyTableActive: boolean) => ({
  "& table td": { height: "3rem" },
  "& table th:first-of-type": {
    position: "sticky",
    left: 0,
    zIndex: 2,
    background: getThemedColor("neutral", 200)
  },
  "& table td:first-of-type": {
    position: "sticky",
    left: 0,
    zIndex: 2,
    background: getThemedColor("neutral", 100),
    transition: "background-color 0.15s ease-in-out"
  },
  "& table th:nth-of-type(2)": {
    position: "sticky",
    left: "3rem",
    zIndex: 2,
    background: getThemedColor("neutral", 200),
    padding: 0
  },
  "& table td:nth-of-type(2)": {
    position: "sticky",
    left: "3rem",
    zIndex: 2,
    background: getThemedColor("neutral", 100),
    padding: 0,
    transition: "background-color 0.15s ease-in-out"
  },
  "& table tbody tr:hover td:nth-of-type(2), & table tbody tr:hover td:first-of-type, & table tbody tr[aria-selected='true'] td:nth-of-type(2), & table tbody tr[aria-selected='true'] td:first-of-type":
    {
      background: getThemedColor("primary", 100)
    },
  "& table th:nth-of-type(2) > div, & table td:nth-of-type(2) div": {
    position: "relative",
    padding: "0.75rem",
    display: "flex",
    alignItems: "center",
    height: "100%"
  },
  ...(isStickyTableActive && {
    "& table th:nth-of-type(2), & table td:nth-of-type(2)": {
      boxShadow: `inset -0.063rem 0 0 0 ${getThemedColor("neutral", 400)}`
    }
  })
});
