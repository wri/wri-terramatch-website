import { SystemStyleObject } from "@chakra-ui/react";

import { getThemedColor } from "@/lib/theme";

export const searchStyles: SystemStyleObject = {
  '& input[type="search"]': {
    border: `1px solid ${getThemedColor("neutral", 300)}`
  },
  "& svg": {
    fill: `${getThemedColor("neutral", 600)}`
  },
  "&:has(input:focus:not(:disabled)) svg, &:has(input:active:not(:disabled)) svg, &:has(input:not(:placeholder-shown):not(:disabled)) svg":
    {
      fill: `${getThemedColor("primary", 700)} !important`
    },
  "&:has(input:disabled) svg": {
    fill: `${getThemedColor("neutral", 600)} !important`
  }
};
