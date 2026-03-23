import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const DraftIcon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask
        id="mask0_13675_35618"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="16"
        height="16"
      >
        <rect width="16" height="16" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_13675_35618)">
        <path
          d="M8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0ZM4 10.333V12H5.66699L10.583 7.08301L8.91699 5.41699L4 10.333ZM10.5205 4C10.3957 4.00007 10.2913 4.04174 10.208 4.125L9.39551 4.9375L11.0625 6.60449L11.875 5.79199C11.9583 5.70873 11.9999 5.60435 12 5.47949C12 5.35457 11.9582 5.2503 11.875 5.16699L10.833 4.125C10.7497 4.04178 10.6454 4 10.5205 4Z"
          fill="currentColor"
        />
      </g>
    </svg>
  </Icon>
);

export default DraftIcon;
