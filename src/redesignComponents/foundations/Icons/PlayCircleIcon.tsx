import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const PlayCircleIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask
        id="mask0_16300_5149"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="36"
        height="36"
      >
        <rect width="36" height="36" fill="currentColor" />
      </mask>
      <g mask="url(#mask0_16300_5149)">
        <path
          d="M13.5 26.1L26.1 18L13.5 9.9V26.1ZM18 36C15.51 36 13.17 35.5275 10.98 34.5825C8.79 33.6375 6.885 32.355 5.265 30.735C3.645 29.115 2.3625 27.21 1.4175 25.02C0.4725 22.83 0 20.49 0 18C0 15.51 0.4725 13.17 1.4175 10.98C2.3625 8.79 3.645 6.885 5.265 5.265C6.885 3.645 8.79 2.3625 10.98 1.4175C13.17 0.4725 15.51 0 18 0C20.49 0 22.83 0.4725 25.02 1.4175C27.21 2.3625 29.115 3.645 30.735 5.265C32.355 6.885 33.6375 8.79 34.5825 10.98C35.5275 13.17 36 15.51 36 18C36 20.49 35.5275 22.83 34.5825 25.02C33.6375 27.21 32.355 29.115 30.735 30.735C29.115 32.355 27.21 33.6375 25.02 34.5825C22.83 35.5275 20.49 36 18 36Z"
          fill="white"
        />
      </g>
    </svg>
  </Icon>
);

export default PlayCircleIcon;
