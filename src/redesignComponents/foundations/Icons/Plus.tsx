import { Icon, IconProps } from "@chakra-ui/react";
import type { FC } from "react";

export const Plus: FC<IconProps> = props => (
  <Icon {...props}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.2857 13.7143H0V10.2857H10.2857V0H13.7143V10.2857H24V13.7143H13.7143V24H10.2857V13.7143Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);
