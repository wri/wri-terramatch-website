import { Box } from "@chakra-ui/react";
import { Badge as BadgeComponent } from "@worldresources/wri-design-systems";
import { FC } from "react";

export interface BadgeProps {
  notificationCount?: number;
  hasNotification?: boolean;
  label?: string;
}

const Badge: FC<BadgeProps> = ({ notificationCount, hasNotification, label }) => {
  return (
    <Box
      css={{
        "& span, & div:not([aria-hidden='true'])": {
          padding: "2px",
          paddingRight: "3px"
        },
        "& span, & p": {
          fontSize: "8px"
        }
      }}
    >
      <BadgeComponent notificationCount={notificationCount} hasNotification={hasNotification} label={label} />
    </Box>
  );
};

export default Badge;
