import { CollapsibleContent, CollapsibleRoot, Tabs, TabsList, TabsRoot } from "@chakra-ui/react";
import { FC, useCallback } from "react";

import { TabType } from "./formNavigation.constants";
import { NavigationTabItem } from "./NavigationTabItem";
import { SidebarToggle } from "./SidebarToggle";
import { useFormNavigation } from "./useFormNavigation";

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
  children?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

const FormNavigation: FC<FormNavigationProps> = props => {
  const { tabs, defaultValue, onTabClick, children, onOpenChange } = props;

  const { hideSidebar, selectedTab, handleTabClick, handleSidebarToggle } = useFormNavigation({
    defaultValue,
    defaultTabValue: tabs?.[0]?.value,
    onTabClick,
    onOpenChange
  });

  const handleValueChange = useCallback(
    ({ value }: { value: string }) => {
      handleTabClick(value);
    },
    [handleTabClick]
  );

  return (
    <div className="">
      <div className="">
        <TabsRoot
          defaultValue={defaultValue ?? tabs?.[0]?.value}
          orientation="horizontal"
          width="full"
          onValueChange={handleValueChange}
          role="tablist"
        >
          {/* @ts-expect-error - Chakra UI v3 type definitions missing children support */}
          <TabsList className="flex flex-col items-center border-none">
            {tabs.map((tab, index) => {
              const { label, value, disabled, "aria-label": ariaLabel, type = "available" } = tab;
              return (
                <NavigationTabItem
                  key={value}
                  value={value}
                  label={label}
                  index={index}
                  type={type}
                  disabled={disabled}
                  ariaLabel={ariaLabel}
                  isSelected={value === selectedTab}
                />
              );
            })}
          </TabsList>
        </TabsRoot>

        {children != null && <SidebarToggle isHidden={hideSidebar} onToggle={handleSidebarToggle} />}
      </div>

      {children != null && (
        <CollapsibleRoot defaultOpen open={!hideSidebar}>
          {/* @ts-expect-error - Chakra UI v3 type definitions missing children support */}
          <CollapsibleContent height="100%">
            <div role="tabpanel" aria-labelledby={selectedTab}>
              {children}
            </div>
          </CollapsibleContent>
        </CollapsibleRoot>
      )}
    </div>
  );
};

export default FormNavigation;
