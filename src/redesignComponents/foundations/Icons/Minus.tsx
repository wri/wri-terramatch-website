import { Icon, IconProps } from "@chakra-ui/react";
import type { FC } from "react";

export const Minus: FC<IconProps> = props => (
  <Icon {...props}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 13.5V10.5H24V13.5H0Z" fill="currentColor" />
    </svg>
  </Icon>
);
