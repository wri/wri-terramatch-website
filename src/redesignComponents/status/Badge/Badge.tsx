import { Box, type BoxProps } from "@chakra-ui/react";
import { Badge as WriBadge } from "@worldresources/wri-design-systems";
import type { ComponentProps, FC } from "react";

export type BadgeVariant = "notification" | "information";

export type BadgeProps = ComponentProps<typeof WriBadge> & {
  variant?: BadgeVariant;
  className?: BoxProps["className"];
  css?: BoxProps["css"];
};

const INFORMATION_STYLES = {
  "& div:has(> p[aria-label]), & div[aria-hidden='true']": {
    backgroundColor: "information.300"
  },
  "& p[aria-label]": {
    color: "information.900"
  }
};

const Badge: FC<BadgeProps> = ({ variant = "notification", className, css, ...props }) => {
  if (variant === "notification") {
    return <WriBadge {...props} />;
  }

  return (
    <Box className={className} css={[INFORMATION_STYLES, css]}>
      <WriBadge {...props} />
    </Box>
  );
};

export default Badge;
