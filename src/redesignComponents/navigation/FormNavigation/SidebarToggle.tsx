import { CollapsibleRoot, CollapsibleTrigger } from "@chakra-ui/react";

import { ChevronDown, ChevronRight } from "@/redesignComponents/foundations/Icons";

interface SidebarToggleProps {
  isHidden: boolean;
  onToggle: (state: { open: boolean }) => void;
}

export const SidebarToggle = ({ isHidden, onToggle }: SidebarToggleProps) => {
  return (
    <CollapsibleRoot onOpenChange={onToggle}>
      {/* @ts-ignore - Chakra UI v3 type definitions missing children support */}
      <CollapsibleTrigger asChild>
        <button type="button" className="flex items-center gap-2">
          <div>{isHidden ? <ChevronRight /> : <ChevronDown />}</div>
          <div className="ds-tab-label">
            <p>{isHidden ? "Show" : "Hide"}</p>
            <p>Sidebar</p>
          </div>
        </button>
      </CollapsibleTrigger>
    </CollapsibleRoot>
  );
};
