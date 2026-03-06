import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const IndeterminateIcon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 2C0 0.895431 0.895431 0 2 0H14C15.1046 0 16 0.895431 16 2V14C16 15.1046 15.1046 16 14 16H2C0.895431 16 0 15.1046 0 14V2Z"
        fill="#FBF7EA"
      />
      <path d="M4 8.5V7.5H12V8.5H4Z" fill="#A88100" />
    </svg>
  </Icon>
);

export default IndeterminateIcon;
