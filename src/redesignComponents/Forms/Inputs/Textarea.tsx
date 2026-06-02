import { Box } from "@chakra-ui/react";
import { css } from "@emotion/react";
import { Textarea as WriTextarea } from "@worldresources/wri-design-systems";
import type { ComponentProps, FC } from "react";

type WriTextareaProps = ComponentProps<typeof WriTextarea>;

export type TextareaProps = WriTextareaProps;

const Textarea: FC<TextareaProps> = ({ ...rest }) => (
  <Box
    css={css`
      & > div {
        margin-bottom: 0 !important;
      }
    `}
  >
    <WriTextarea {...rest} />
  </Box>
);

export default Textarea;
