import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const DisallowedIcon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_15433_4484)">
        <path
          d="M8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0ZM8 7.2002L4.7998 4L4 4.7998L7.2002 8L4 11.2002L4.7998 12L8 8.7998L11.2002 12L12 11.2002L8.7998 8L12 4.7998L11.2002 4L8 7.2002Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_15433_4484">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  </Icon>
);

export default DisallowedIcon;
