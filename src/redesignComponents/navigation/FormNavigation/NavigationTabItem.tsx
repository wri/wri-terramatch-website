import { Box, Flex, TabsTrigger, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";

import { TabType } from "./formNavigation.constants";
import { getTabClasses } from "./formNavigation.utils";
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
  const t = useT();
  return (
    <TabsTriggerTyped
      value={value}
      disabled={disabled}
      aria-label={ariaLabel ?? label}
      className={getTabClasses(isSelected)}
    >
      <Box display="flex" alignItems="center" flexDirection="row" gap="0.3125rem" className="w-full justify-between">
        <Flex alignItems="center" textAlign="left" color="primary.900">
          <NavigationTabBadge type={type} isSelected={isSelected} index={index} />

          <Text
            className="truncate whitespace-nowrap"
            textStyle={isSelected ? "400-bold" : "400"}
            color={isSelected ? "primary.900" : "neutral.700"}
          >
            {t(label)}
          </Text>
        </Flex>
        <ChevronRightIcon />
      </Box>
    </TabsTriggerTyped>
  );
};
