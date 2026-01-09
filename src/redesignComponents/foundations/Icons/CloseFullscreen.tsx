import { Icon, IconProps } from "@chakra-ui/react";
import React from "react";

export const CloseFullscreen = (props: IconProps) => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.12 16L0 14.88L5.28 9.6H1.6V8H8V14.4H6.4V10.72L1.12 16ZM8 8V1.6H9.6V5.28L14.88 0L16 1.12L10.72 6.4H14.4V8H8Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);
