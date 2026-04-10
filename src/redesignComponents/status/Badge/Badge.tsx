import { Box } from "@chakra-ui/react";
import { Badge as WriBadge } from "@worldresources/wri-design-systems";
import { ComponentProps, FC } from "react";

const Badge: FC<ComponentProps<typeof WriBadge>> = props => {
  return (
    <Box
      css={{
        "& span, & div:not([aria-hidden='true'])": {
          padding: "2px",
          paddingRight: "3px"
        },
        "& p[aria-label]": {
          fontSize: "8px"
        }
      }}
    >
      <WriBadge {...props} />
    </Box>
  );
};

export default Badge;
