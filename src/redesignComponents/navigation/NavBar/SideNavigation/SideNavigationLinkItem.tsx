import { Button, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import NextLink from "next/link";
import type { FC, KeyboardEvent, MouseEvent, ReactNode } from "react";

import MenuCustom from "@/redesignComponents/actions/Buttons/Menu/MenuCustom";
import { MenuItemOption } from "@/redesignComponents/actions/Buttons/Menu/MenuCustom.types";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import { MoreVertIcon, PlusIcon } from "@/redesignComponents/foundations/Icons";
import Badge from "@/redesignComponents/status/Badge/Badge";
import NumberBadge from "@/redesignComponents/status/Badge/NumberBadge";

import { useIsRouteActive } from "./useIsRouteActive";

export interface SideNavigationLinkItemProps {
  icon: ReactNode;
  label: string;
  href: string;
  activePaths?: string[];
  onAddClick?: () => void;
  MenuItems?: MenuItemOption[];
  isCollapsed: boolean;
  notificationValue?: number;
}

const actionButtonClassName = "min-h-0 min-w-0 h-fit";

export const SIDE_NAVIGATION_ROW_CLASS_NAME = classNames(
  "relative w-full items-center justify-between gap-2 rounded-md border-2",
  "h-9 border-theme-primary-800 px-3 py-2 hover:bg-theme-primary-500/20 active:bg-theme-primary-500/40"
);

const SideNavigationLinkItem: FC<SideNavigationLinkItemProps> = ({
  icon,
  label,
  href,
  activePaths,
  onAddClick,
  MenuItems = [],
  isCollapsed,
  notificationValue = 0
}) => {
  const t = useT();
  const isActive = useIsRouteActive(href, activePaths);

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
          boxShadow: "0 0 0 0.125rem var(--chakra-colors-primary-800)"
        }
      }}
      className={classNames(
        SIDE_NAVIGATION_ROW_CLASS_NAME,
        isActive ? "text-theme-primary-300" : "text-theme-neutral-100"
      )}
    >
      <Tooltip content={t(label)} position="right" disabled={!isCollapsed} preserveFocusOnChild>
        <NextLink
          href={href}
          aria-label={t(label)}
          className="min-w-0 flex-1 after:absolute after:-inset-0.5 after:rounded-md focus:outline-none"
          onKeyDown={handleLinkKeyDown}
        >
          <Flex alignItems="center" gap={2}>
            <Badge
              size="small"
              notificationCount={isCollapsed && notificationValue > 0 ? notificationValue : undefined}
            >
              {icon}
            </Badge>
            {isCollapsed ? null : (
              <>
                <Text textStyle={isActive ? "400-bold" : "400"}>{t(label)}</Text>
                <NumberBadge count={notificationValue} />
              </>
            )}
          </Flex>
        </NextLink>
      </Tooltip>
      {isCollapsed ? null : (
        <Flex alignItems="center" gap={2} className="relative z-10">
          {onAddClick != null ? (
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
