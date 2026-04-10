import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const CheckIndeterminateIcon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 13.5V10.5H24V13.5H0Z" fill="currentColor" />
    </svg>
  </Icon>
);

export default CheckIndeterminateIcon;
