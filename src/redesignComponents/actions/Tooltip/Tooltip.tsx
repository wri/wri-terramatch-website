import { Tooltip as WriTooltip } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

const Tooltip: FC<ComponentProps<typeof WriTooltip>> = props => <WriTooltip {...props} />;

export default Tooltip;
