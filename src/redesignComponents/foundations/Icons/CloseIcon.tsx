import { Icon, IconProps } from "@chakra-ui/react";
import { FC } from "react";

export const CloseIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.20003 12L3.05176e-05 10.8L4.80003 6L3.05176e-05 1.2L1.20003 0L6.00003 4.8L10.8 0L12 1.2L7.20003 6L12 10.8L10.8 12L6.00003 7.2L1.20003 12Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);

export default CloseIcon;
