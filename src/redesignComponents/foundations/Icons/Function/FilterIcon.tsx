import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const FilterIcon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.5 6.66667V5.55556H7.5V6.66667H2.5ZM1.25 3.88889V2.77778H8.75V3.88889H1.25ZM0 1.11111V0H10V1.11111H0Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);

export default FilterIcon;
