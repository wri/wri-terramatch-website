import { SerializedStyles } from "@emotion/react";
import styled from "@emotion/styled";
import { TextInput as WriTextInput } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

import { getThemedColor } from "@/lib/theme";

type TextInputProps = ComponentProps<typeof WriTextInput> & {
  css?: SerializedStyles;
};

const StyledWrapper = styled.div<{ css?: SerializedStyles }>`
  & input:is(: disabled, [disabled], [data-disabled], [aria-disabled="true"]) {
    opacity: 1;
  }

  & input:not(:placeholder-shown) {
    border-color: ${getThemedColor("neutral", 700)};
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
