import { Tooltip as WriTooltip } from "@worldresources/wri-design-systems";
import { FC } from "react";

const Tooltip: FC<React.ComponentProps<typeof WriTooltip>> = props => {
  return <WriTooltip {...props} />;
};

export default Tooltip;
