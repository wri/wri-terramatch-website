import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const DashboardIcon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.875 0H16V5.33333H8.875V0ZM8.875 16V7.125H16V16H8.875ZM0 16V10.6667H7.125V16H0ZM0 8.875V0H7.125V8.875H0Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);

export default DashboardIcon;
