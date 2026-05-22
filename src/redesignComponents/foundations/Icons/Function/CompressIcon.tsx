import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const CompressIcon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.77778 10.2222L5.77778 15.5556H4L4 13.2444L1.24444 16L-1.43762e-07 14.7556L2.75556 12H0.444445L0.444445 10.2222H5.77778ZM14.7556 1.43762e-07L16 1.24445L13.2444 4H15.5556V5.77778L10.2222 5.77778V0.444444L12 0.444445V2.75556L14.7556 1.43762e-07Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);

export default CompressIcon;
