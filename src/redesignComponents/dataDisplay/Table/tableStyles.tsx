import type { SystemStyleObject } from "@chakra-ui/react";

import { getThemedColor } from "@/lib/theme";

export const getTableWrapperStyles = (
  selectable?: boolean,
  dataByPage?: unknown[],
  pageSize?: number,
  actualTotalItems?: number,
  css?: SystemStyleObject
): SystemStyleObject => {
  const shouldHidePagination =
    actualTotalItems != null ? actualTotalItems <= (pageSize ?? 0) : dataByPage?.length === 0;

  const { "& > div > div": cssScrollContainer, ...restCss } = css ?? {};

  return {
    ...(shouldHidePagination && {
      "& [data-scope='pagination']": {
        display: "none"
      },
      "& [data-scope='select'][data-part='root']": {
        display: "none"
      },
      "& div:has(.ds-select-input-container)": {
        display: "none"
      },
      "& [data-scope='table'][data-part='footer']": {
        display: "none"
      }
    }),
    position: "relative",
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    "& > div > div": {
      overflowX: "auto",
      maxWidth: "100%",
      width: "100%",
      ...(typeof cssScrollContainer === "object" && cssScrollContainer != null ? cssScrollContainer : {})
    },

    "& table tbody td": {
      borderBottom: "none"
    },
    "& table tbody tr": {
      borderBottom: `0.125rem solid ${getThemedColor("neutral", 300)}`
    },
    "& table tbody tr:hover, & table tbody tr:hover td[data-sticky], & table tbody tr[data-hovered], & table tbody tr[data-hovered] td[data-sticky]":
      {
        backgroundColor: getThemedColor("primary", 100)
      },

    "& button[data-scope='pagination'][data-part='item']:not([data-selected]):not([aria-current='page'])": {
      color: `${getThemedColor("neutral", 600)} !important`,
      fontWeight: "bold !important",
      "& p": {
        color: `${getThemedColor("neutral", 600)} !important`,
        fontWeight: "bold !important"
      }
    },
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

    ...(selectable && {
      "& table thead th:first-of-type": {
        width: "1%",
        minWidth: "3rem",
        maxWidth: "3rem",
        padding: "0.5rem"
      },
      "& table tbody td:first-of-type": {
        width: "1%",
        minWidth: "3rem",
        maxWidth: "3rem",
        padding: "0.5rem"
      }
    }),

    "& [data-scope='select'][data-part='value-text'] p": {
      fontWeight: "700 !important",
      color: `${getThemedColor("neutral", 700)} !important`
    },

    "& [data-scope='select'][data-part='trigger']": {
      border: `1px solid ${getThemedColor("neutral", 400)} !important`
    },

    ...restCss
  };
};

export const HIDDEN_STICKY_COLUMN_EDGE_STYLES: SystemStyleObject = {
  "& table [data-sticky-last='true']": {
    borderInlineEnd: "none"
  },
  "& table [data-sticky-last='true']::after": {
    content: "none"
  }
};

export const NO_HEADER_TABLE_WRAPPER_STYLES: SystemStyleObject = {
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

export const FULL_WIDTH_TABLE_HEADER_STYLES: SystemStyleObject = {
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
