import { CollapsibleRoot, CollapsibleTrigger } from "@chakra-ui/react";

import { ChevronDown, ChevronRight } from "@/redesignComponents/foundations/Icons";

interface SidebarToggleProps {
  isHidden: boolean;
  onToggle: (state: { open: boolean }) => void;
}

const CollapsibleTriggerAsChild = CollapsibleTrigger as React.ComponentType<{
  asChild?: boolean;
  children?: React.ReactNode;
}>;

export const SidebarToggle = ({ isHidden, onToggle }: SidebarToggleProps) => {
  return (
    <CollapsibleRoot onOpenChange={onToggle}>
      <CollapsibleTriggerAsChild asChild>
        <button type="button" className="flex items-center gap-2">
          <div>{isHidden ? <ChevronRight /> : <ChevronDown />}</div>
          <div className="ds-tab-label">
            <p>{isHidden ? "Show" : "Hide"}</p>
            <p>Sidebar</p>
          </div>
        </button>
      </CollapsibleTriggerAsChild>
    </CollapsibleRoot>
  );
};
