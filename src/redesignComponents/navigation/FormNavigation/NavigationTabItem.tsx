import { Box, TabsTrigger } from "@chakra-ui/react";
import { FC } from "react";

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

export const NavigationTabItem: FC<NavigationTabItemProps> = ({
  value,
  label,
  index,
  type = "available",
  disabled,
  ariaLabel,
  isSelected
}) => {
  return (
    // @ts-expect-error - Chakra UI v3 type definitions missing children support
    <TabsTrigger
      value={value}
      disabled={disabled}
      aria-label={ariaLabel ?? label}
      className={getTabClasses(isSelected)}
    >
      <Box display="flex" alignItems="center" flexDirection="row" gap="5px" className="w-full justify-between">
        <span className="text-theme-primary-900 flex items-center text-left">
          <NavigationTabBadge type={type} isSelected={isSelected} index={index} />

          {label != null && <p className={getLabelClasses(isSelected)}>{label}</p>}
        </span>
        <ChevronRight />
      </Box>
    </TabsTrigger>
  );
};
