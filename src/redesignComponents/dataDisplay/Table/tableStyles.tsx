import { getThemedColor } from "@/lib/theme";

import type { SortColumn } from "./tableUtils";

export const getTableWrapperStyles = (
  sortColumn: SortColumn,
  columns?: any[],
  selectable?: boolean,
  scrollable?: boolean,
  scrollableWidth?: string,
  scrollableHeight?: string
) => {
  const sortedColumnIndex =
    columns != null && sortColumn.key !== "" ? columns.findIndex((col: any) => col.key === sortColumn.key) : -1;

  const thIndex = sortedColumnIndex >= 0 ? sortedColumnIndex + 1 + (selectable ? 1 : 0) : -1;

  return {
    ...(scrollable && {
      "& ": {
        width: scrollableWidth
      }
    }),
    "& table tbody tr": {
      backgroundColor: "transparent",
      borderBottom: `1px solid ${getThemedColor("neutral", 300)}`,
      transition: "background-color 0.15s ease-in-out"
    },

    "& table": {
      ...(scrollable && {
        display: "flow",
        width: scrollableWidth,
        height: scrollableHeight,
        overflow: "auto"
      })
    },

    ...(scrollable && {
      "& table thead": {
        position: "sticky",
        top: 0,
        zIndex: 10
      },
      "& table thead th": {}
    }),

    "& table tbody tr:hover": {
      backgroundColor: getThemedColor("primary", 100),
      borderBottom: `1px solid ${getThemedColor("primary", 700)}`
    },

    "& button svg path": {
      fill: `${getThemedColor("neutral", 500)} !important`
    },
    "& button ": {
      backgroundColor: "transparent"
    },

    ...(sortColumn.key !== "" &&
      sortColumn.order === "asc" &&
      thIndex > 0 && {
        [`& table thead th:nth-child(${thIndex})`]: {
          '& button[aria-label="Ascending"]': {
            "& svg path": {
              fill: `${getThemedColor("accessible", "controls-on-neutral-lights")} !important`
            }
          }
        }
      }),
    ...(sortColumn.key !== "" &&
      sortColumn.order === "desc" &&
      thIndex > 0 && {
        [`& table thead th:nth-child(${thIndex})`]: {
          '& button[aria-label="Descending"]': {
            "& svg path": {
              fill: `${getThemedColor("accessible", "controls-on-neutral-lights")} !important`
            }
          }
        }
      }),
    ...(sortColumn.key !== "" &&
      sortColumn.order !== "" && {
        [`& table thead th[data-column-key="${sortColumn.key}"]`]: {
          fontWeight: "bold"
        }
      })
  };
};
