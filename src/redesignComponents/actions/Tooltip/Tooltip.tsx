import { Tooltip as WriTooltip } from "@worldresources/wri-design-systems";
import type { ReactNode, RefObject } from "react";

// Type assertion needed due to WRI Tooltip's complex return type definition
// and React type conflicts between different versions in node_modules
const WriTooltipComponent = WriTooltip;

type TooltipProps = {
  children: ReactNode;
  content: ReactNode;
  showArrow?: boolean;
  disabled?: boolean;
  position?: "top" | "right" | "bottom" | "left";
  variant?: "pill" | "text";
  portalRef?: RefObject<HTMLElement | null>;
  openDelay?: number;
  closeDelay?: number;
};

const Tooltip = (props: TooltipProps) => {
  return <WriTooltipComponent {...props} />;
};

export default Tooltip;
