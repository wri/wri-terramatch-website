import { Icon, IconProps } from "@chakra-ui/react";
import React from "react";

export const Notification = (props: IconProps) => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_12453_66996)">
        <path
          d="M7.99585 16C9.25977 16 10.2885 14.9745 10.2939 13.7118H5.69788C5.70337 14.9744 6.73193 16 7.99585 16Z"
          fill="currentColor"
        />
        <path
          d="M14.2106 12.7737V12.0912C14.2106 11.3503 13.7648 10.6915 13.108 10.4019V6.52185C13.108 5.4281 12.7614 4.40417 12.1055 3.56079C11.5471 2.8429 10.7917 2.28613 9.90662 1.93701V1.91077C9.90662 0.857178 9.04944 0 7.99585 0C6.94226 0 6.08521 0.857178 6.08521 1.91077V1.93701C5.20007 2.28613 4.4447 2.8429 3.88635 3.56079C3.23047 4.40417 2.88367 5.4281 2.88367 6.52185V10.4017C2.22705 10.6914 1.78125 11.3503 1.78125 12.0912V12.7736H14.2106V12.7737Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_12453_66996">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  </Icon>
);
