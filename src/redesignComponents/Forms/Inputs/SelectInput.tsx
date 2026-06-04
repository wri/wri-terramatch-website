import styled from "@emotion/styled";
import { Select as WriSelect } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

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
`;

const SelectInput: FC<ComponentProps<typeof WriSelect>> = props => (
  <StyledWrapper>
    <WriSelect {...props} />
  </StyledWrapper>
);

export default SelectInput;
