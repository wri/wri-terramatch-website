import { Icon, IconProps } from "@chakra-ui/react";
import { FC } from "react";

export const ArrowOutwardIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <svg width="13" height="25" viewBox="0 0 13 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M-6.54163e-06 18.75L1.74999 17L5 20.2187L5 13.75L7.5 13.75L7.5 20.2187L10.75 17L12.5 18.75L6.25 25L-6.54163e-06 18.75ZM-5.99524e-06 6.25L6.25 -2.73196e-07L12.5 6.25L10.75 8L7.5 4.78125L7.5 11.25L5 11.25L5 4.78125L1.74999 8L-5.99524e-06 6.25Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);

export default ArrowOutwardIcon;
