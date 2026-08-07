import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const FolderOpenIcon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.86047 14.8837C1.34884 14.8837 0.910853 14.7016 0.546512 14.3372C0.182171 13.9729 0 13.5349 0 13.0233V1.86047C0 1.34884 0.182171 0.910853 0.546512 0.546512C0.910853 0.182171 1.34884 0 1.86047 0H7.44186L9.30233 1.86047H16.7442C17.2558 1.86047 17.6938 2.04264 18.0581 2.40698C18.4225 2.77132 18.6047 3.2093 18.6047 3.72093H1.86047V13.0233L4.09302 5.5814H20L17.6047 13.5581C17.4806 13.9612 17.2519 14.2829 16.9186 14.5233C16.5853 14.7636 16.2171 14.8837 15.814 14.8837H1.86047Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);

export default FolderOpenIcon;
