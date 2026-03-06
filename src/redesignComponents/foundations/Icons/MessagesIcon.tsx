import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const MessagesIcon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.6 12C1.16 12 0.783333 11.8531 0.47 11.5594C0.156667 11.2656 0 10.9125 0 10.5V1.5C0 1.0875 0.156667 0.734375 0.47 0.440625C0.783333 0.146875 1.16 0 1.6 0H14.4C14.84 0 15.2167 0.146875 15.53 0.440625C15.8433 0.734375 16 1.0875 16 1.5V10.5C16 10.9125 15.8433 11.2656 15.53 11.5594C15.2167 11.8531 14.84 12 14.4 12H1.6ZM8 6.75L14.4 3V1.5L8 5.25L1.6 1.5V3L8 6.75Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);

export default MessagesIcon;
