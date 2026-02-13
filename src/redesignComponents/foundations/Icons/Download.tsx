import { Icon, IconProps } from "@chakra-ui/react";
import React from "react";

export const Download = (props: IconProps) => (
  <Icon {...props}>
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 5.625H1.25V8.75H8.75V5.625H10V8.75V10H1.25H0V5.625Z" fill="currentColor" />
      <rect x="4.375" width="1.25" height="6.25" fill="currentColor" />
      <path
        d="M8.75 3.36876L7.82084 2.5L5 5.13748L2.17916 2.5L1.25 3.36876L5 6.875L8.75 3.36876Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);
