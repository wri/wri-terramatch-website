import { FC } from "react";

import TabBar, { TabBarWriProps } from "../TabBar/TabBar";
import Toolbar from "./Toolbar";

interface ViewToolbarProps {
  tabBar: TabBarWriProps;
}

const ViewToolbar: FC<ViewToolbarProps> = ({ tabBar }: ViewToolbarProps) => {
  return <Toolbar contentLeft={<TabBar {...tabBar} variant="transparent" />} />;
};

export default ViewToolbar;
