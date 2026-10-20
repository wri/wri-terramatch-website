import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const MenuIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1H17M1 9H17M1 17H17" strokeWidth="2" strokeLinecap="round" stroke="currentColor" />
    </svg>
  </Icon>
);

export default MenuIcon;
