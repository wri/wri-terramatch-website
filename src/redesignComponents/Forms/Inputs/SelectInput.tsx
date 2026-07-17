import styled from "@emotion/styled";
import { Select as WriSelect } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

const StyledWrapper = styled.div`
  /* Chakra disabled layerStyle still fades controls; DS does not override opacity yet. */
  & label:is(:disabled, [disabled], [data-disabled], [aria-disabled="true"]),
  & button:is(:disabled, [disabled], [data-disabled], [aria-disabled="true"]) {
    opacity: 1;
  }
`;

const SelectInput: FC<ComponentProps<typeof WriSelect>> = props => (
  <StyledWrapper>
    <WriSelect {...props} />
  </StyledWrapper>
);

export default SelectInput;
