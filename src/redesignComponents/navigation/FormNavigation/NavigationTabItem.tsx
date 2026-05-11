import { Box, TabsTrigger } from "@chakra-ui/react";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";

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

interface TabsTriggerPropsWithChildren {
  value: string;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
  children?: React.ReactNode;
}

const TabsTriggerTyped = TabsTrigger as React.ComponentType<TabsTriggerPropsWithChildren>;

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
    <TabsTriggerTyped
      value={value}
      disabled={disabled}
      aria-label={ariaLabel ?? label}
      className={getTabClasses(isSelected)}
    >
      <Box display="flex" alignItems="center" flexDirection="row" gap="0.3125rem" className="w-full justify-between">
        <span className="text-theme-primary-900 flex items-center text-left">
          <NavigationTabBadge type={type} isSelected={isSelected} index={index} />

          {label != null && (
            <p className={twMerge("truncate whitespace-nowrap", getLabelClasses(isSelected))}>{label}</p>
          )}
        </span>
        <ChevronRightIcon />
      </Box>
    </TabsTriggerTyped>
  );
};
