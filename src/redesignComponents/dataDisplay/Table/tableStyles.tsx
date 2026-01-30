import { getThemedColor } from "@/lib/theme";

export const tableWrapperStyles = {
  "& table tbody tr": {
    backgroundColor: "transparent",
    borderBottom: `1px solid ${getThemedColor("neutral", 300)}`,
    transition: "background-color 0.15s ease-in-out"
  },

  "& table tbody tr:hover": {
    backgroundColor: getThemedColor("primary", 100),
    borderBottom: `1px solid ${getThemedColor("primary", 700)}`
  }
};
