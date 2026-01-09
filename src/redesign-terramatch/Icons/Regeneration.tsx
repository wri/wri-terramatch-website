import { Icon, IconProps } from "@chakra-ui/react";
import React from "react";

export const Regeneration = (props: IconProps) => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask
        id="mask0_13072_11834"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="16"
        height="16"
      >
        <rect width="16" height="16" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_13072_11834)">
        <path d="M0 13L4.36364 7L7.63636 11.5H9.47273L6.72727 7.75L9.45455 4L16 13H0Z" fill="currentColor" />
      </g>
    </svg>
  </Icon>
);
