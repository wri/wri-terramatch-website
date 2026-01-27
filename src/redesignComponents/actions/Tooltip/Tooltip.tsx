import { Tooltip as WriTooltip } from "@worldresources/wri-design-systems";
import { FC, ReactElement } from "react";

import { TooltipProps } from "./types.d";

const Tooltip: FC<TooltipProps> = props => {
  const result = WriTooltip(props);
  return (result as ReactElement) ?? <>{props.children}</>;
};

export default Tooltip;
export type { TooltipProps };
