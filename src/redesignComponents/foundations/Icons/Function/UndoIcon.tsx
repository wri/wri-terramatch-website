import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const UndoIcon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.6667 4.33333L2.54333 4.33333L4.93467 1.94267L4 1L1.11624e-07 5L4 9L4.93467 8.05667L2.54533 5.66667L10.6667 5.66667C11.7275 5.66667 12.7449 6.08809 13.4951 6.83824C14.2452 7.58839 14.6667 8.6058 14.6667 9.66667C14.6667 10.7275 14.2452 11.7449 13.4951 12.4951C12.7449 13.2452 11.7275 13.6667 10.6667 13.6667L5.33333 13.6667L5.33333 15L10.6667 15C12.0812 15 13.4377 14.4381 14.4379 13.4379C15.4381 12.4377 16 11.0812 16 9.66667C16 8.25218 15.4381 6.89562 14.4379 5.89543C13.4377 4.89524 12.0812 4.33333 10.6667 4.33333Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);

export default UndoIcon;
