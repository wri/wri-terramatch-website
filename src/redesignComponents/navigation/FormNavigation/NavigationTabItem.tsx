import { Box, TabsTrigger } from "@chakra-ui/react";

import { ChevronRight } from "@/redesignComponents/foundations/Icons";

import { TabType } from "./formNavigation.constants";
import { getLabelClasses, getTabClasses } from "./formNavigation.utils";
import { NavigationTabBadge } from "./NavigationTabBadge";

interface NavigationTabItemProps {
  value: string;
  label: string;
  index: number;
  type?: TabType;
  disabled?: boolean;
  ariaLabel?: string;
  isSelected: boolean;
}

export const NavigationTabItem = ({
  value,
  label,
  index,
  type = "available",
  disabled,
  ariaLabel,
  isSelected
}: NavigationTabItemProps) => {
  return (
    // @ts-ignore - Chakra UI v3 type definitions missing children support
    <TabsTrigger
      value={value}
      disabled={disabled}
      aria-label={ariaLabel || label}
      className={getTabClasses(isSelected)}
    >
      <Box display="flex" alignItems="center" flexDirection="row" gap="5px" className="w-full justify-between">
        <span className="flex items-center text-left text-theme-primary-900">
          <NavigationTabBadge type={type} isSelected={isSelected} index={index} />

          {label && <p className={getLabelClasses(isSelected)}>{label}</p>}
        </span>
        <ChevronRight />
      </Box>
    </TabsTrigger>
  );
};
