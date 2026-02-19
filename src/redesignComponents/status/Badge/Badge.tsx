import { Box } from "@chakra-ui/react";
import { Badge as BadgeComponent } from "@worldresources/wri-design-systems";
import { FC } from "react";

export interface BadgeProps {
  notificationCount?: number;
}

const Badge: FC<BadgeProps> = ({ notificationCount }) => {
  return (
    <Box>
      <BadgeComponent notificationCount={notificationCount} />
    </Box>
  );
};

export default Badge;
