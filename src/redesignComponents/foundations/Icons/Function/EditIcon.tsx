import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const EditIcon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.75 3.58333L14.125 5.20833L10.7917 1.875L12.4167 0.25C12.5833 0.0833333 12.7917 0 13.0417 0C13.2917 0 13.5 0.0833333 13.6667 0.25L15.75 2.33333C15.9167 2.5 16 2.70833 16 2.95833C16 3.20833 15.9167 3.41667 15.75 3.58333ZM0 12.6667L9.83333 2.83333L13.1667 6.16667L3.33333 16H0V12.6667Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);

export default EditIcon;
