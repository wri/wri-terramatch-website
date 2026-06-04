import styled from "@emotion/styled";
import { Textarea as WriTextarea } from "@worldresources/wri-design-systems";
import type { ComponentProps, FC } from "react";

type WriTextareaProps = ComponentProps<typeof WriTextarea>;

export type TextareaProps = WriTextareaProps;

const StyledWrapper = styled.div`
  & textarea {
    margin-top: 0 !important;
  }
  ,
  & > div {
    margin-bottom: 0 !important;
  }
  ,
  & > div > div:has(label, span) textarea {
    margin-top: 0.5rem !important;
  }

  & > div > div:not(:has(label, span)) textarea {
    margin-top: 0 !important;
  }
`;

const Textarea: FC<TextareaProps> = ({ ...rest }) => (
  <StyledWrapper>
    <WriTextarea {...rest} />
  </StyledWrapper>
);

export default Textarea;
