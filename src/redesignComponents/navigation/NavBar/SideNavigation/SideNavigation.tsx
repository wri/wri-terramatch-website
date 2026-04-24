import { Button, Flex, Text } from "@chakra-ui/react";
import classNames from "classnames";
import React, { FC, useState } from "react";

import { MenuItemOption } from "@/redesignComponents/actions/Buttons/Menu/MenuCustom.types";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

import SideNavigationItem from "./SideNavigationItem";

const EXPANDED_WIDTH_CLASS = "w-56";
const COLLAPSED_WIDTH_CLASS = "w-12";

interface SideNavigationLink {
  icon: React.ReactNode;
  label: string;
  href?: string;
  notificationValue?: number;
  onAddClick?: () => void;
  MenuItems?: MenuItemOption[];
  items?: {
    icon: React.ReactNode;
    label: string;
    onAddClick?: () => void;
    href?: string;
    MenuItems?: MenuItemOption[];
  }[];
}

interface SideNavigationGroup {
  links: SideNavigationLink[];
}

interface SideNavigationProps {
  title: string;
  groups: SideNavigationGroup[];
}

const SideNavigation: FC<SideNavigationProps> = ({ title, groups }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const shellTransition = "overflow-hidden transition-[width] duration-300 ease-in-out motion-reduce:transition-none";

  return (
    <Flex
      className={classNames(
        "flex-col bg-theme-primary-800",
        shellTransition,
        isCollapsed ? COLLAPSED_WIDTH_CLASS : EXPANDED_WIDTH_CLASS
      )}
    >
      <Button
        className={classNames(
          "flex min-h-0 items-center justify-start px-4 py-3.5 transition-[gap] duration-300 ease-in-out motion-reduce:transition-none",
          isCollapsed ? "gap-0" : "gap-2"
        )}
        color="neutral.100"
        onClick={handleCollapse}
      >
        <Text
          textStyle="400-bold"
          className={classNames(isCollapsed ? "max-w-0 opacity-0" : "max-w-[12.5rem] opacity-100")}
        >
          {title}
        </Text>
        <ChevronRightIcon
          boxSize={4}
          className={classNames(
            "shrink-0 transition-transform duration-300 ease-in-out motion-reduce:transition-none",
            isCollapsed ? "rotate-180" : "rotate-0"
          )}
        />
      </Button>
      {groups.map((group, index) => (
        <React.Fragment key={index}>
          <SimpleDivider backgroundColor="primary.700" />
          <Flex
            className={classNames(
              "flex flex-col gap-1 py-2 transition-[padding] duration-300 ease-in-out motion-reduce:transition-none",
              isCollapsed ? "px-0" : "px-2"
            )}
          >
            {group.links.map(link => (
              <SideNavigationItem
                key={link.label}
                icon={link.icon}
                label={link.label}
                href={link.href}
                notificationValue={link.notificationValue}
                onAddClick={link.onAddClick}
                MenuItems={link.MenuItems}
                items={link.items}
                isCollapsed={isCollapsed}
              />
            ))}
          </Flex>
        </React.Fragment>
      ))}
      <SimpleDivider backgroundColor="primary.700" />
    </Flex>
  );
};

export default SideNavigation;
