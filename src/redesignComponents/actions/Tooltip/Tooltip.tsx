import { Tooltip as WriTooltip } from "@worldresources/wri-design-systems";
import type { ReactNode, RefObject } from "react";

const WriTooltipComponent = WriTooltip as any;

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
