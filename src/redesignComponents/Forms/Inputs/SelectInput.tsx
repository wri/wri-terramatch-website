import styled from "@emotion/styled";
import { Select as WriSelect } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

import { getThemedColor } from "@/lib/theme";

const StyledWrapper = styled.div`
  & {
    width: 100%;
  }
  & label:is(:disabled, [disabled], [data-disabled], [aria-disabled="true"]) {
    opacity: 1;
  }
  & button:is(: disabled, [disabled], [data-disabled], [aria-disabled="true"]) {
    opacity: 1;
  }
  & button:is(: disabled, [disabled], [data-disabled], [aria-disabled="true"]) span {
    color: ${getThemedColor("neutral", 600)} !important;
  }
  & button[data-part="trigger"] {
    border-color: ${getThemedColor("neutral", 300)};
  }
  & button[data-part="trigger"]:not([data-placeholder-shown]) {
    border-color: ${getThemedColor("neutral", 700)};
  }
  & button[data-part="trigger"][data-disabled] {
    border-color: ${getThemedColor("neutral", 300)};
  }
`;

const SelectInput: FC<ComponentProps<typeof WriSelect>> = props => (
  <StyledWrapper>
    <WriSelect {...props} />
  </StyledWrapper>
);

export default SelectInput;
