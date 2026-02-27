import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const RejectedIcon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask
        id="mask0_13656_290"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="16"
        height="16"
      >
        <rect width="16" height="16" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_13656_290)">
        <path
          d="M8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0ZM8 7.01172L5.98828 5L5 5.98828L7.01172 8L5 10.0117L5.98828 11L8 8.98828L10.0117 11L11 10.0117L8.98828 8L11 5.98828L10.0117 5L8 7.01172Z"
          fill="currentColor"
        />
      </g>
    </svg>
  </Icon>
);

export default RejectedIcon;
