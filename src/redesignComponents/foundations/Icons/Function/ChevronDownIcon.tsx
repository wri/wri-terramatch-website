import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const ChevronDownIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 13.3667L0 5.36667L1.86667 3.5L8 9.63333L14.1333 3.5L16 5.36667L8 13.3667Z" fill="currentColor" />
    </svg>
  </Icon>
);

export default ChevronDownIcon;
