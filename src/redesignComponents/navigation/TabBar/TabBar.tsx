import { Box } from "@chakra-ui/react";
import { TabBar as TabBarWri } from "@worldresources/wri-design-systems";
import { FC } from "react";

export type TabBarWriProps = React.ComponentProps<typeof TabBarWri>;

const TabBar: FC<TabBarWriProps> = props => {
  return (
    <Box
      css={{
        "& button": {
          textWrap: "nowrap !important"
        },
        "& > div:first-of-type": {
          minWidth: "max-content",
          width: "100%"
        }
      }}
      className="w-max-content"
    >
      <TabBarWri {...props} />
    </Box>
  );
};

export default TabBar;
