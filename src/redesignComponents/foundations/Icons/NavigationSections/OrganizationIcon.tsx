import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const OrganizationIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 15V1H8V4.11111H16V15H0ZM1.6 13.4444H6.4V11.8889H1.6V13.4444ZM1.6 10.3333H6.4V8.77778H1.6V10.3333ZM1.6 7.22222H6.4V5.66667H1.6V7.22222ZM1.6 4.11111H6.4V2.55556H1.6V4.11111ZM8 13.4444H14.4V5.66667H8V13.4444ZM9.6 8.77778V7.22222H12.8V8.77778H9.6ZM9.6 11.8889V10.3333H12.8V11.8889H9.6Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);

export default OrganizationIcon;
