import {
  Box,
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
  Tabs,
  TabsList,
  TabsRoot,
  TabsTrigger
} from "@chakra-ui/react";
import classNames from "classnames";
import { useState } from "react";

import { Check, ChevronDown, ChevronRight, InformationRequired } from "@/redesignComponents/foundations/Icons";

export interface NavigationRailTabProps extends Omit<Tabs.TriggerProps, "asChild"> {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  "aria-label"?: string;
  type?: "complete" | "available" | "disabled" | "error";
}

export interface FormNavigationProps {
  tabs: NavigationRailTabProps[];
  defaultValue?: string;
  onTabClick?: (selectedValue: string) => void;
  children?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

const FormNavigation = (props: FormNavigationProps) => {
  const { tabs, defaultValue, onTabClick, children, onOpenChange } = props;
  const [hideSidebar, setHideSidebar] = useState(false);
  const [selectedTab, setSelectedTab] = useState(defaultValue || tabs?.[0]?.value);

  const handleOnTabClick = (selectedValue: string) => {
    setSelectedTab(selectedValue);
    if (onTabClick) {
      onTabClick(selectedValue);
    }
  };

  const handleOnOpenChange = ({ open }: { open: boolean }) => {
    setHideSidebar(open);

    if (onOpenChange) {
      onOpenChange(!open);
    }
  };

  return (
    <div className="">
      <div className="">
        <TabsRoot
          defaultValue={defaultValue || tabs?.[0]?.value}
          orientation="horizontal"
          width="full"
          onValueChange={({ value }: { value: string }) => {
            handleOnTabClick(value);
          }}
          role="tablist"
        >
          {/* @ts-expect-error - Chakra UI v3 type definitions missing children support */}
          <TabsList className="flex flex-col items-center border-none">
            {tabs.map((tab, index) => {
              const { label, value, disabled, "aria-label": ariaLabel, type = "available" } = tab;
              return (
                // @ts-expect-error - Chakra UI v3 type definitions missing children support
                <TabsTrigger
                  key={value}
                  value={value}
                  disabled={disabled}
                  aria-label={ariaLabel || label}
                  className={classNames(
                    "border-theme-neutral-300 text-theme-primary-900 hover:bg-theme-primary-100 group h-13 w-72 gap-0 rounded-sm border-b px-2 before:!h-0",
                    {
                      "!border-theme-primary-900 border": value === selectedTab
                    }
                  )}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    flexDirection="row"
                    gap="5px"
                    className="w-full justify-between"
                  >
                    <span className="text-theme-primary-900 flex items-center text-left">
                      <div
                        className={classNames(
                          "text-18-bold mr-2 flex h-8 w-8 items-center justify-center rounded-full border",
                          {
                            "border-theme-primary-400 text-theme-primary-800 group-hover:bg-theme-primary-400":
                              type === "complete" || value === selectedTab,
                            "border-theme-neutral-500 text-theme-neutral-700 group-hover:bg-theme-neutral-300":
                              type === "available" || type === "disabled",
                            "border-theme-error-300 bg-theme-error-500": type === "error"
                          }
                        )}
                      >
                        {type === "error" ? (
                          <div>
                            <InformationRequired className="text-theme-error-100 h-[calc(2rem-2px)] w-[calc(2rem-2px)]" />
                          </div>
                        ) : (
                          <>
                            {type === "complete" && <Check className="max-w-4 w-4" />}
                            {(value === selectedTab || type === "available" || type === "disabled") &&
                              type !== "complete" && (
                                <div
                                  className={classNames("text-18-bold leading-[normal]", {
                                    " text-theme-primary-800": value === selectedTab,
                                    " text-theme-neutral-700": type === "available" || type === "disabled"
                                  })}
                                >
                                  {index + 1}
                                </div>
                              )}
                          </>
                        )}
                      </div>

                      {label ? (
                        <p
                          className={classNames({
                            "text-16-light text-theme-neutral-700": value != selectedTab,
                            "text-16-bold text-theme-primary-900": value === selectedTab
                          })}
                        >
                          {label}
                        </p>
                      ) : null}
                    </span>
                    <ChevronRight />
                  </Box>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </TabsRoot>

        {children ? (
          <CollapsibleRoot onOpenChange={handleOnOpenChange}>
            {/* @ts-expect-error - Chakra UI v3 type definitions missing children support */}
            <CollapsibleTrigger>
              <div>{hideSidebar ? <ChevronRight /> : <ChevronDown />}</div>
              <div className="ds-tab-label">
                <p>{hideSidebar ? "Show" : "Hide"}</p>
                <p>Sidebar</p>
              </div>
            </CollapsibleTrigger>
          </CollapsibleRoot>
        ) : null}
      </div>
      {children ? (
        <CollapsibleRoot defaultOpen open={!hideSidebar}>
          {/* @ts-expect-error - Chakra UI v3 type definitions missing children support */}
          <CollapsibleContent height="100%">
            <div role="tabpanel" aria-labelledby={selectedTab}>
              {children}
            </div>
          </CollapsibleContent>
        </CollapsibleRoot>
      ) : null}
    </div>
  );
};

export default FormNavigation;
