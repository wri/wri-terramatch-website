import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const ExpandIcon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_13336_4726)">
        <path
          d="M0 16V10.6667H1.77778V12.9778L4.53333 10.2222L5.77778 11.4667L3.02222 14.2222H5.33333V16H0ZM11.4667 5.77778L10.2222 4.53333L12.9778 1.77778H10.6667V0H16V5.33333H14.2222V3.02222L11.4667 5.77778Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_13336_4726">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  </Icon>
);

export default ExpandIcon;
