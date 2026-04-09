import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const UploadIcon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 5.625H1.25V8.75H8.75V5.625H10V8.75V10H1.25H0V5.625Z" fill="currentColor" />
      <rect x="4.375" y="1.25" width="1.25" height="6.25" fill="currentColor" />
      <path
        d="M8.75 3.50624L7.82084 4.375L5 1.73752L2.17916 4.375L1.25 3.50624L5 0L8.75 3.50624Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);

export default UploadIcon;
