import styled from "@emotion/styled";
import { Toolbar as WriToolbar } from "@worldresources/wri-design-systems";
import { ComponentProps, FC } from "react";

const StyledWrapper = styled.div`
  & button > div {
    justify-content: flex-start !important;
  }
`;

const ToolbarExpandable: FC<ComponentProps<typeof WriToolbar>> = props => {
  return (
    <StyledWrapper>
      <WriToolbar {...props} />
    </StyledWrapper>
  );
};

export default ToolbarExpandable;
