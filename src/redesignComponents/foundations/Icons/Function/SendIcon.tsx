import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const SendIcon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M-0.112257 13.4713L-0.0271768 8.41957L6.737 6.85751L0.0295435 5.05174L0.114624 0L15.9987 7.02507L-0.112257 13.4713Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);

export default SendIcon;
