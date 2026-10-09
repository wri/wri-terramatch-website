import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const ProjectIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.66667 14.6666V12.6666H11.3333V14.6666H8.66667ZM4.66667 14.6666V11.9999H0L2.56667 7.99992H1.33333L6 1.33325L10.6667 7.99992H9.43333L12.0167 11.9999H7.33333V14.6666H4.66667ZM12.8333 11.9999L10.6667 8.66658H11.95L8.41667 3.61659L10 1.33325L14.6667 7.99992H13.4333L16 11.9999H12.8333Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);

export default ProjectIcon;
