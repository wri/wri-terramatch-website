import { Box } from "@chakra-ui/react";
import { TabBar as TabBarWri } from "@worldresources/wri-design-systems";
import { FC } from "react";

export type TabBarWriProps = React.ComponentProps<typeof TabBarWri>;

const TabBar: FC<TabBarWriProps> = props => {
  return (
    <Box
      css={{
        // "& [role='tablist']": { width: "max-content" },
        "& button": {
          textWrap: "nowrap !important"
        }
      }}
    >
      <TabBarWri {...props} />
    </Box>
  );
};

export default TabBar;
