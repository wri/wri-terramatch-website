import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const DrawingToolIcon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask
        id="mask0_17462_5105"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="16"
        height="16"
      >
        <rect width="16" height="16" fill="currentColor" />
      </mask>
      <g mask="url(#mask0_17462_5105)">
        <path
          d="M8.49835 16H3.01593V14.7285H8.49835V16ZM9.51202 7.9375C9.49729 7.97572 7.58384 12.9438 8.05011 14.2568C7.89545 14.2816 3.7528 14.3 3.56378 14.2686C3.92676 12.557 2.0216 8.07636 2.00031 8.02637L5.55011 1.22754V6.16602C4.82758 6.26693 4.26886 6.88252 4.26886 7.63281C4.26924 8.45391 4.93504 9.11987 5.75616 9.12012C6.57699 9.11996 7.24309 8.45359 7.24347 7.63281C7.24347 6.88278 6.68634 6.26762 5.96417 6.16602V1.19434L9.51202 7.9375ZM12.6907 2.21484H14.9026V3.18164H12.6907V5.3916H11.723V3.18164H9.51105V2.21484H11.723V0H12.6907V2.21484Z"
          fill="currentColor"
        />
      </g>
    </svg>
  </Icon>
);

export default DrawingToolIcon;
