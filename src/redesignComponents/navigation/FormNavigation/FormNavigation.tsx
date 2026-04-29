import { Tabs, TabsList, TabsRoot } from "@chakra-ui/react";
import { FC, useCallback } from "react";

import { TabType } from "./formNavigation.constants";
import { NavigationTabItem } from "./NavigationTabItem";
import { useFormNavigation } from "./useFormNavigation";

interface TabsListPropsWithChildren {
  className?: string;
  children?: React.ReactNode;
}

const TabsListTyped = TabsList as React.ComponentType<TabsListPropsWithChildren>;

export interface NavigationRailTabProps extends Omit<Tabs.TriggerProps, "asChild"> {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  "aria-label"?: string;
  type?: TabType;
}

export interface FormNavigationProps {
  tabs: NavigationRailTabProps[];
  defaultValue?: string;
  onTabClick?: (selectedValue: string) => void;
}

const FormNavigation: FC<FormNavigationProps> = props => {
  const { tabs, defaultValue, onTabClick } = props;

  const { selectedTab, handleTabClick } = useFormNavigation({
    defaultValue,
    defaultTabValue: tabs?.[0]?.value,
    onTabClick
  });

  const handleValueChange = useCallback(
    ({ value }: { value: string }) => {
      handleTabClick(value);
    },
    [handleTabClick]
  );

  return (
    <div className="w-fit overflow-y-auto overflow-x-clip pr-4 pb-4">
      <div className="w-fit">
        <TabsRoot
          value={selectedTab}
          orientation="horizontal"
          width="full"
          onValueChange={handleValueChange}
          role="tablist"
        >
          <TabsListTyped className="flex flex-col items-center border-none">
            {tabs.map((tab, index) => {
              const { label, value, disabled, "aria-label": ariaLabel, type = "available" } = tab;
              return (
                <NavigationTabItem
                  key={value}
                  value={value}
                  label={label}
                  index={index}
                  type={disabled ? "disabled" : type}
                  disabled={disabled}
                  ariaLabel={ariaLabel}
                  isSelected={value === selectedTab}
                />
              );
            })}
          </TabsListTyped>
        </TabsRoot>
      </div>
    </div>
  );
};

export default FormNavigation;
