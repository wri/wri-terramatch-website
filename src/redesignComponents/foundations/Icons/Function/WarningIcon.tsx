import { Icon, IconProps } from "@chakra-ui/react";
import { FC } from "react";

export const WarningIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 13.8182L8 0L16 13.8182H0ZM8 11.6364C8.20606 11.6364 8.37879 11.5667 8.51818 11.4273C8.65758 11.2879 8.72727 11.1152 8.72727 10.9091C8.72727 10.703 8.65758 10.5303 8.51818 10.3909C8.37879 10.2515 8.20606 10.1818 8 10.1818C7.79394 10.1818 7.62121 10.2515 7.48182 10.3909C7.34242 10.5303 7.27273 10.703 7.27273 10.9091C7.27273 11.1152 7.34242 11.2879 7.48182 11.4273C7.62121 11.5667 7.79394 11.6364 8 11.6364ZM7.27273 9.45455H8.72727V5.81818H7.27273V9.45455Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);

export default WarningIcon;
