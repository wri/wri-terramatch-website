import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

export const PhotoLibraryIcon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.5 6H8.5L6.775 3.75L5.625 5.25L4.85 4.25L3.5 6ZM3 8C2.725 8 2.48958 7.90208 2.29375 7.70625C2.09792 7.51042 2 7.275 2 7V1C2 0.725 2.09792 0.489583 2.29375 0.29375C2.48958 0.0979167 2.725 0 3 0H9C9.275 0 9.51042 0.0979167 9.70625 0.29375C9.90208 0.489583 10 0.725 10 1V7C10 7.275 9.90208 7.51042 9.70625 7.70625C9.51042 7.90208 9.275 8 9 8H3ZM1 10C0.725 10 0.489583 9.90208 0.29375 9.70625C0.0979167 9.51042 0 9.275 0 9V2H1V9H8V10H1Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);

export default PhotoLibraryIcon;
