import { Icon, IconProps } from "@chakra-ui/react";
import React from "react";

export const Delete = (props: IconProps) => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask
        id="mask0_13721_2032"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="16"
        height="16"
      >
        <rect width="16" height="16" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_13721_2032)">
        <path
          d="M3.625 15.875C3.14375 15.875 2.73177 15.7036 2.38906 15.3609C2.04635 15.0182 1.875 14.6062 1.875 14.125V2.75H1V1H5.375V0.125H10.625V1H15V2.75H14.125V14.125C14.125 14.6062 13.9536 15.0182 13.6109 15.3609C13.2682 15.7036 12.8562 15.875 12.375 15.875H3.625ZM5.375 12.375H7.125V4.5H5.375V12.375ZM8.875 12.375H10.625V4.5H8.875V12.375Z"
          fill="currentColor"
        />
      </g>
    </svg>
  </Icon>
);
