import { SerializedStyles } from "@emotion/react";
import styled from "@emotion/styled";
import { TextInput as WriTextInput } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

type TextInputProps = ComponentProps<typeof WriTextInput> & {
  ref?: React.RefObject<HTMLInputElement>;
  css?: SerializedStyles;
};

const StyledWrapper = styled.div<{ css?: SerializedStyles }>`
  ${props => props.css}
`;

const TextInput: FC<TextInputProps> = props => {
  const { css: cssProp, ref, ...rest } = props;

  return (
    <StyledWrapper css={cssProp}>
      <WriTextInput ref={ref} {...rest} />
    </StyledWrapper>
  );
};

export default TextInput;
