import { FC } from "react";

import TabBar from "../TabBar/TabBar";
import Toolbar from "./Toolbar";
import { ViewToolbarProps } from "./ToolBar.type";

const ViewToolbar: FC<ViewToolbarProps> = ({ tabBar }: ViewToolbarProps) => {
  return <Toolbar contentLeft={<TabBar {...tabBar} variant="transparent" />} />;
};

export default ViewToolbar;
