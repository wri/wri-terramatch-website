import { getThemedColor } from "@/lib/theme";

export const paginationButtonStyles = {
  "& button": {
    backgroundColor: "transparent"
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
  }
};

const baseItemCountStyles = {
  "& [data-scope='select'][data-part='value-text'] p": {
    fontWeight: "700 !important",
    color: `${getThemedColor("neutral", 700)} !important`
  },

  "& div:has(.ds-select-input-container) > p": {
    textTransform: "lowercase !important"
  },

  "& [data-scope='select'][data-part='trigger']": {
    border: `0.0625rem solid ${getThemedColor("neutral", 400)} !important`
  }
};

export const itemCountStyles = (css?: any) => ({
  ...baseItemCountStyles,
  "& > div > p": {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    zIndex: 0
  },
  ...css
});

export const paginationTableStyles = {
  ...paginationButtonStyles,
  ...baseItemCountStyles
};
