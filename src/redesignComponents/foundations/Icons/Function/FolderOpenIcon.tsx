import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const FolderOpenIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.488 12C1.079 12 0.729 11.853 0.437 11.559C0.146 11.266 0 10.913 0 10.5V1.5C0 1.087 0.146 0.734 0.437 0.441C0.729 0.147 1.079 0 1.488 0H5.953L7.442 1.5H13.395C13.805 1.5 14.155 1.647 14.447 1.941C14.738 2.234 14.884 2.588 14.884 3H1.488V10.5L3.274 4.5H16L14.084 10.931C13.984 11.256 13.802 11.516 13.535 11.709C13.268 11.903 12.974 12 12.651 12H1.488Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);

export default FolderOpenIcon;
