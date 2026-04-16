import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const ChevronDownAltIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 8.125L0 3.125H10L5 8.125Z" fill="currentColor" />
    </svg>
  </Icon>
);

export default ChevronDownAltIcon;
