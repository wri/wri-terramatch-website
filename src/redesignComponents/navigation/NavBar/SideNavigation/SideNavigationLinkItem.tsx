import { Button, Flex, Text } from "@chakra-ui/react";
import classNames from "classnames";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { FC, KeyboardEvent, MouseEvent, ReactNode } from "react";

import MenuCustom from "@/redesignComponents/actions/Buttons/Menu/MenuCustom";
import { MenuItemOption } from "@/redesignComponents/actions/Buttons/Menu/MenuCustom.types";
import { MoreVertIcon, PlusIcon } from "@/redesignComponents/foundations/Icons";
import Badge from "@/redesignComponents/status/Badge/BadgeCustom";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";

export interface SideNavigationLinkItemProps {
  icon: ReactNode;
  label: string;
  href: string;
  onAddClick?: () => void;
  MenuItems?: MenuItemOption[];
  isCollapsed: boolean;
  notificationValue?: number;
}

const actionButtonClassName = "min-h-0 min-w-0 h-fit";

const SideNavigationLinkItem: FC<SideNavigationLinkItemProps> = ({
  icon,
  label,
  href,
  onAddClick,
  MenuItems = [],
  isCollapsed,
  notificationValue = 0
}) => {
  const pathname = usePathname();
  let currentPath = "";

  if (pathname != null) {
    currentPath = `${pathname}${
      typeof window !== "undefined" ? `${window.location.search}${window.location.hash}` : ""
    }`;
  } else if (typeof window !== "undefined") {
    currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  }

  const isActive = currentPath === href;

  const handleLinkKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key === "Enter") {
      event.currentTarget.click();
    }
  };

  const handleMenuTriggerClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  const handleAddClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onAddClick?.();
  };

  return (
    <Flex
      data-side-navigation-item-row
      css={{
        "&:has(a:focus-visible)": {
          borderColor: "var(--chakra-colors-neutral-100)",
          boxShadow: "0 0 0 2px var(--chakra-colors-primary-800)"
        }
      }}
      className={classNames(
        "w-full items-center justify-between gap-2 rounded-md border-2",
        "border-theme-primary-800 hover:bg-theme-primary-500/20 active:bg-theme-primary-500/40 h-9 px-3 py-2",
        isActive ? "text-theme-primary-300" : "text-theme-neutral-100"
      )}
    >
      <NextLink href={href} className="min-w-0 flex-1 focus:outline-none" onKeyDown={handleLinkKeyDown}>
        <Flex alignItems="center" gap={2}>
          <Badge hasNotification={isCollapsed} notificationCount={notificationValue}>
            {icon}
          </Badge>
          {isCollapsed ? null : (
            <>
              <Text textStyle="400">{label}</Text>
              {notificationValue > 0 ? (
                <TextBadge variant="error" className="py-0">
                  {notificationValue}
                </TextBadge>
              ) : null}
            </>
          )}
        </Flex>
      </NextLink>
      {isCollapsed ? null : (
        <Flex alignItems="center" gap={2}>
          {onAddClick ? (
            <Button onClick={handleAddClick} className={actionButtonClassName}>
              <PlusIcon boxSize={4} />
            </Button>
          ) : null}
          {MenuItems.length > 0 ? (
            <MenuCustom
              customTrigger={
                <Button onClick={handleMenuTriggerClick} className={actionButtonClassName}>
                  <MoreVertIcon boxSize={4} />
                </Button>
              }
              items={MenuItems}
            />
          ) : null}
        </Flex>
      )}
    </Flex>
  );
};

export default SideNavigationLinkItem;
