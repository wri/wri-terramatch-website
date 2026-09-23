import { Tooltip as WriTooltip } from "@worldresources/wri-design-systems";
import type { ComponentProps, FC } from "react";

type TooltipProps = ComponentProps<typeof WriTooltip>;

const Tooltip: FC<TooltipProps> = props => <WriTooltip {...props} />;

export default Tooltip;
