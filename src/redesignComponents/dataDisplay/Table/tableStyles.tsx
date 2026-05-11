import { getThemedColor } from "@/lib/theme";

import type { SortColumn } from "./tableUtils";

export const getTableWrapperStyles = (
  sortColumn: SortColumn,
  columns?: any[],
  selectable?: boolean,
  scrollable?: boolean,
  scrollableWidth?: string,
  scrollableHeight?: string,
  dataByPage?: any[],
  pageSize?: number,
  actualTotalItems?: number,
  css?: any
) => {
  const sortedColumnIndex =
    columns != null && sortColumn.key !== "" ? columns.findIndex((col: any) => col.key === sortColumn.key) : -1;

  const thIndex = sortedColumnIndex >= 0 ? sortedColumnIndex + 1 + (selectable ? 1 : 0) : -1;

  const shouldHidePagination =
    actualTotalItems != null ? actualTotalItems <= (pageSize ?? 0) : dataByPage?.length === 0;

  return {
    ...(shouldHidePagination && {
      "& [data-scope='pagination']": {
        display: "none"
      },
      "& [data-scope='select'][data-part='root']": {
        display: "none"
      }
    }),
    ...(scrollable && {
      "& ": {
        width: scrollableWidth,
        position: "relative"
      }
    }),
    position: "relative",
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
      }
    }),

    "& table tbody tr:hover": {
      backgroundColor: getThemedColor("primary", 100),
      borderBottom: `1px solid ${getThemedColor("primary", 700)}`
    },

    "& table thead button svg path": {
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
      }),

    // Pagination button styles - non-selected
    "& button[data-scope='pagination'][data-part='item']:not([data-selected]):not([aria-current='page'])": {
      color: `${getThemedColor("neutral", 600)} !important`,
      fontWeight: "bold !important",
      "& p": {
        color: `${getThemedColor("neutral", 600)} !important`,
        fontWeight: "bold !important"
      }
    },
    // Pagination selected button styles
    "& button[data-selected]": {
      color: `${getThemedColor("neutral", 900)} !important`,
      fontWeight: "bold !important",
      "& p": {
        color: `${getThemedColor("neutral", 900)} !important`,
        fontWeight: "bold !important"
      }
    },
    "& button[aria-current='page']": {
      color: `${getThemedColor("neutral", 900)} !important`,
      fontWeight: "bold !important",

      "& p": {
        color: `${getThemedColor("neutral", 900)} !important`,
        fontWeight: "bold !important"
      }
    },

    // Checkbox column styles - minimum width
    ...(selectable && {
      "& table thead th:first-of-type": {
        width: "1%",
        minWidth: "48px",
        maxWidth: "48px",
        padding: "0.5rem"
      },
      "& table tbody td:first-of-type": {
        width: "1%",
        minWidth: "48px",
        maxWidth: "48px",
        padding: "0.5rem"
      }
    }),

    // Page size select value styles (e.g. the "10" inside the Per Page select)
    "& [data-scope='select'][data-part='value-text'] p": {
      fontWeight: "700 !important",
      color: `${getThemedColor("neutral", 700)} !important`
    },

    // "Per Page" label styles - find the wrapper div that contains the DS select
    // and target its direct <p> child (the "Per Page" label)
    "& div:has(.ds-select-input-container) > p": {
      textTransform: "lowercase !important"
    },

    // Per Page select trigger button border
    "& [data-scope='select'][data-part='trigger']": {
      border: `1px solid ${getThemedColor("neutral", 400)} !important`
    },

    ...css
  };
};

export const NO_HEADER_TABLE_WRAPPER_STYLES = {
  "& table": {
    tableLayout: "fixed !important"
  },
  "& table thead": {
    display: "none"
  },
  "& table tbody tr": {
    borderBottom: "0px!important"
  },
  "& table tbody tr td": {
    padding: "0px !important",
    borderBottom: "0px!important"
  },
  "& table tbody tr:hover": {
    backgroundColor: getThemedColor("neutral", 100)
  }
};

export const FULL_WIDTH_TABLE_HEADER_STYLES = {
  "& table thead tr th": {
    backgroundColor: getThemedColor("neutral", 200)
  },

  "& table thead tr th:not(:last-child)": {
    marginRight: "2px",
    borderRight: `2px solid ${getThemedColor("neutral", 100)}`
  },

  "& table tbody tr td:not(:last-child)": {
    marginRight: "2px",
    borderRight: `2px solid ${getThemedColor("neutral", 100)}`
  },

  "& table tbody tr:hover": {
    backgroundColor: getThemedColor("neutral", 100)
  }
};
