import styled from "@emotion/styled";

import { getThemedColor } from "@/lib/theme";

export const StyledSearchWrapper = styled.div`
  input[type="search"] {
    border: 1px solid ${getThemedColor("neutral", 300)} !important;
  }

  svg {
    fill: ${getThemedColor("neutral", 600)} !important;
  }

  &:has(input:focus) svg,
  &:has(input:active) svg,
  &:has(input:not(:placeholder-shown):not(:disabled)) svg {
    fill: ${getThemedColor("primary", 700)} !important;
  }
`;
