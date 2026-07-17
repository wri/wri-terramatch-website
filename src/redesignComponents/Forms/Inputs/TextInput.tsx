import { SerializedStyles } from "@emotion/react";
import styled from "@emotion/styled";
import { TextInput as WriTextInput } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

type TextInputProps = ComponentProps<typeof WriTextInput> & {
  css?: SerializedStyles;
};

const StyledWrapper = styled.div<{ css?: SerializedStyles }>`
  /* Chakra disabled layerStyle still fades inputs; DS does not override opacity yet. */
  & input:is(:disabled, [disabled], [data-disabled], [aria-disabled="true"]) {
    opacity: 1;
  }

  ${props => props.css}
`;

const TextInput: FC<TextInputProps> = props => {
  const { css: cssProp, ...rest } = props;

  return (
    <StyledWrapper css={cssProp}>
      <WriTextInput {...rest} />
    </StyledWrapper>
  );
};

export default TextInput;
