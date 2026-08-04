import { getThemedColor } from "@/lib/theme";

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
  ...baseItemCountStyles
};
