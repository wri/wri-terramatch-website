import { TabBar as TabBarWri } from "@worldresources/wri-design-systems";
import { FC } from "react";

type TabBarWriProps = React.ComponentProps<typeof TabBarWri>;

const TabBar: FC<TabBarWriProps> = props => {
  return <TabBarWri {...props} />;
};

export default TabBar;
