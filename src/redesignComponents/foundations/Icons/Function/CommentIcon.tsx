import { Icon, IconProps } from "@chakra-ui/react";
import { FC } from "react";

export const CommentIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 16V1.6C0 1.16 0.156667 0.783333 0.47 0.47C0.783333 0.156667 1.16 0 1.6 0H14.4C14.84 0 15.2167 0.156667 15.53 0.47C15.8433 0.783333 16 1.16 16 1.6V11.2C16 11.64 15.8433 12.0167 15.53 12.33C15.2167 12.6433 14.84 12.8 14.4 12.8H3.2L0 16Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);

export default CommentIcon;
