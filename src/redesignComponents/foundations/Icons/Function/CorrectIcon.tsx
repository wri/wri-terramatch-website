import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const CorrectIcon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 2C0 0.895431 0.895431 0 2 0H14C15.1046 0 16 0.895431 16 2V14C16 15.1046 15.1046 16 14 16H2C0.895431 16 0 15.1046 0 14V2Z"
        fill="#EBF5F2"
      />
      <path
        d="M6.79755 10.9518L4 8.15428L4.69939 7.4549L6.79755 9.55306L11.3006 5.04999L12 5.74937L6.79755 10.9518Z"
        fill="#009E77"
      />
    </svg>
  </Icon>
);

export default CorrectIcon;
