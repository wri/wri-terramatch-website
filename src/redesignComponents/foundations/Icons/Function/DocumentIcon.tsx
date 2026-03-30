import { Icon, IconProps } from "@chakra-ui/react";
import { FC } from "react";

export const DocumentIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.4 14C1.015 14 0.685417 13.8629 0.41125 13.5888C0.137083 13.3146 0 12.985 0 12.6V1.4C0 1.015 0.137083 0.685417 0.41125 0.41125C0.685417 0.137083 1.015 0 1.4 0H7L11.2 4.2V12.6C11.2 12.985 11.0629 13.3146 10.7888 13.5888C10.5146 13.8629 10.185 14 9.8 14H1.4ZM6.3 4.9H9.8L6.3 1.4V4.9Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);

export default DocumentIcon;
