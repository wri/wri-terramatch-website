import { CollapsibleRoot, CollapsibleTrigger } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { ChevronDown, ChevronRight } from "@/redesignComponents/foundations/Icons";

interface SidebarToggleProps {
  isHidden: boolean;
  onToggle: (state: { open: boolean }) => void;
}

const CollapsibleTriggerAsChild = CollapsibleTrigger as React.ComponentType<{
  asChild?: boolean;
  children?: React.ReactNode;
}>;

export const SidebarToggle: FC<SidebarToggleProps> = ({ isHidden, onToggle }) => {
  const t = useT();

  return (
    <CollapsibleRoot onOpenChange={onToggle}>
      <CollapsibleTriggerAsChild asChild>
        <button type="button" className="flex items-center gap-2">
          <div>{isHidden ? <ChevronRight /> : <ChevronDown />}</div>
          <div className="ds-tab-label">
            <p>{isHidden ? t("Show") : t("Hide")}</p>
            <p>{t("Sidebar")}</p>
          </div>
        </button>
      </CollapsibleTriggerAsChild>
    </CollapsibleRoot>
  );
};
