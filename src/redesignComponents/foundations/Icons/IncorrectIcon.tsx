import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const IncorrectIcon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 2C0 0.895431 0.895431 0 2 0H14C15.1046 0 16 0.895431 16 2V14C16 15.1046 15.1046 16 14 16H2C0.895431 16 0 15.1046 0 14V2Z"
        fill="#FFEFED"
      />
      <path
        d="M4.80002 11.9999L4.00002 11.1999L7.20002 7.99994L4.00002 4.79994L4.80002 3.99994L8.00002 7.19994L11.2 3.99994L12 4.79994L8.80002 7.99994L12 11.1999L11.2 11.9999L8.00002 8.79994L4.80002 11.9999Z"
        fill="#C11101"
      />
    </svg>
  </Icon>
);

export default IncorrectIcon;
