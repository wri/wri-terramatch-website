import { Button, Flex, Link, Text } from "@chakra-ui/react";
import classNames from "classnames";
import React, { FC, useMemo, useState } from "react";

import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";
import Badge from "@/redesignComponents/status/Badge/BadgeCustom";

const EXPANDED_WIDTH_CLASS = "w-56";
const COLLAPSED_WIDTH_CLASS = "w-12";

interface SideNavigationProps {
  title: string;
  notifications: {
    icon: React.ReactNode;
    label: string;
    value: number;
  }[];
  links: {
    icon: React.ReactNode;
    label: string;
    href: string;
  }[];
}

const SideNavigation: FC<SideNavigationProps> = ({ title, notifications, links }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const textClassName = useMemo(() => {
    return classNames(
      "min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-500 ease-in-out",
      isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"
    );
  }, [isCollapsed]);

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
        <Text textStyle="400-bold" className={textClassName}>
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
      <SimpleDivider backgroundColor="primary.700" />
      <Flex className="flex flex-col gap-4 p-4">
        {notifications.map(item => (
          <Flex
            key={item.label}
            className={classNames(
              "h-6 items-center transition-[gap] duration-300 ease-in-out motion-reduce:transition-none",
              isCollapsed ? "gap-0" : "gap-2"
            )}
            color="neutral.100"
          >
            <Badge
              className={classNames(
                "transition-[gap] duration-300 ease-in-out motion-reduce:transition-none",
                isCollapsed ? "gap-0" : "gap-2"
              )}
              labelClassName={textClassName}
              hasNotification={item.value > 0 && isCollapsed}
              notificationCount={item.value}
              label={item.label}
            >
              {item.icon}
            </Badge>
            {item.value > 0 ? (
              <div
                className={classNames(
                  "flex min-w-0 items-center justify-center overflow-hidden rounded-full bg-theme-error-500 transition-[max-width,opacity,transform,padding] duration-300 ease-in-out motion-reduce:transition-none",
                  !isCollapsed ? "max-w-[4rem] scale-100 px-1 opacity-100" : "max-w-0 scale-95 px-0 opacity-0"
                )}
                aria-hidden={isCollapsed}
              >
                <Text textStyle="300-bold" className="whitespace-nowrap">
                  {item.value}
                </Text>
              </div>
            ) : null}
          </Flex>
        ))}
      </Flex>
      <SimpleDivider backgroundColor="primary.700" />
      <Flex className="flex flex-col gap-4 p-4">
        {links.map(link => (
          <Link
            key={link.label}
            href={link.href}
            className={classNames(
              "flex h-6 items-center transition-[gap] duration-300 ease-in-out motion-reduce:transition-none",
              isCollapsed ? "gap-0" : "gap-2"
            )}
            color="neutral.100"
          >
            <span className="shrink-0">{link.icon}</span>
            <Text textStyle="400" className={textClassName}>
              {link.label}
            </Text>
          </Link>
        ))}
      </Flex>
      <SimpleDivider backgroundColor="primary.700" />
    </Flex>
  );
};

export default SideNavigation;
