import { Icon, IconProps } from "@chakra-ui/react";
import React from "react";

export const InformationRequiredSimple = (props: IconProps) => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask
        id="mask0_13696_35344"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="16"
        height="16"
      >
        <rect width="16" height="16" fill="green" />
      </mask>
      <g mask="url(#mask0_13696_35344)">
        <path
          d="M6.85718 10.2857V0H9.14289V10.2857H6.85718ZM6.85718 16V13.7143H9.14289V16H6.85718Z"
          fill="currentColor"
        />
      </g>
    </svg>
  </Icon>
);
