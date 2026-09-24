import { Box, Button, CollapsibleRoot, CollapsibleTrigger, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { ChevronDownIcon, ChevronRightIcon } from "@/redesignComponents/foundations/Icons";

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
        <Button type="button" className="flex items-center gap-2">
          <Box>{isHidden ? <ChevronRightIcon /> : <ChevronDownIcon />}</Box>
          <Box className="ds-tab-label">
            <Text textStyle="400" color="primary.900">
              {isHidden ? t("Show") : t("Hide")}
            </Text>
            <Text textStyle="400" color="primary.900">
              {t("Sidebar")}
            </Text>
          </Box>
        </Button>
      </CollapsibleTriggerAsChild>
    </CollapsibleRoot>
  );
};
