import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const MapViewIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.6667 16L5.33333 14.1333L1.2 15.7333C0.903704 15.8519 0.62963 15.8185 0.377778 15.6333C0.125926 15.4481 0 15.2 0 14.8889V2.44444C0 2.25185 0.0555556 2.08148 0.166667 1.93333C0.277778 1.78519 0.42963 1.67407 0.622222 1.6L5.33333 0L10.6667 1.86667L14.8 0.266667C15.0963 0.148148 15.3704 0.181481 15.6222 0.366667C15.8741 0.551852 16 0.8 16 1.11111V13.5556C16 13.7481 15.9444 13.9185 15.8333 14.0667C15.7222 14.2148 15.5704 14.3259 15.3778 14.4L10.6667 16ZM9.77778 13.8222V3.42222L6.22222 2.17778V12.5778L9.77778 13.8222Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);

export default MapViewIcon;
