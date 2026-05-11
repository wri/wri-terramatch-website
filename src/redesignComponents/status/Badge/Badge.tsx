import { Box } from "@chakra-ui/react";
import { Badge as WriBadge } from "@worldresources/wri-design-systems";
import { ComponentProps, FC } from "react";

const Badge: FC<ComponentProps<typeof WriBadge>> = props => {
  return (
    <Box
      css={{
        "& span, & div:not([aria-hidden='true'])": {
          padding: "0.125rem",
          paddingRight: "0.1875rem"
        },
        "& p[aria-label]": {
          fontSize: "0.5rem"
        }
      }}
    >
      <WriBadge {...props} />
    </Box>
  );
};

export default Badge;
