import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const LinkIcon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <svg width="1rem" height="1rem" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.2 12H4C2.89333 12 1.95 11.61 1.17 10.83C0.39 10.05 0 9.10667 0 8C0 6.89333 0.39 5.95 1.17 5.17C1.95 4.39 2.89333 4 4 4H7.2V5.6H4C3.33333 5.6 2.76667 5.83333 2.3 6.3C1.83333 6.76667 1.6 7.33333 1.6 8C1.6 8.66667 1.83333 9.23333 2.3 9.7C2.76667 10.1667 3.33333 10.4 4 10.4H7.2V12ZM4.8 8.8V7.2H11.2V8.8H4.8ZM8.8 12V10.4H12C12.6667 10.4 13.2333 10.1667 13.7 9.7C14.1667 9.23333 14.4 8.66667 14.4 8C14.4 7.33333 14.1667 6.76667 13.7 6.3C13.2333 5.83333 12.6667 5.6 12 5.6H8.8V4H12C13.1067 4 14.05 4.39 14.83 5.17C15.61 5.95 16 6.89333 16 8C16 9.10667 15.61 10.05 14.83 10.83C14.05 11.61 13.1067 12 12 12H8.8Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);

export default LinkIcon;
