import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const IntensityMediumIcon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 11C0 9.89543 0.895431 9 2 9C3.10457 9 4 9.89543 4 11V14C4 15.1046 3.10457 16 2 16C0.895431 16 0 15.1046 0 14V11Z"
        fill="currentColor"
      />
      <path
        d="M6 7C6 5.89543 6.89543 5 8 5C9.10457 5 10 5.89543 10 7V14C10 15.1046 9.10457 16 8 16C6.89543 16 6 15.1046 6 14V7Z"
        fill="currentColor"
      />
      <path
        d="M12 2C12 0.895431 12.8954 0 14 0C15.1046 0 16 0.895431 16 2V14C16 15.1046 15.1046 16 14 16C12.8954 16 12 15.1046 12 14V2Z"
        fill="#E7E6E6"
      />
    </svg>
  </Icon>
);

export default IntensityMediumIcon;
