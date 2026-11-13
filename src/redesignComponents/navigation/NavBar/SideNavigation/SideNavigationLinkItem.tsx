import { Button, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FC, FocusEvent, KeyboardEvent, MouseEvent, ReactNode, useCallback, useEffect, useRef } from "react";

import { useIsAdmin } from "@/hooks/useIsAdmin";
import MenuCustom from "@/redesignComponents/actions/Buttons/Menu/MenuCustom";
import { MenuItemOption } from "@/redesignComponents/actions/Buttons/Menu/MenuCustom.types";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import { MoreVertIcon, PlusIcon } from "@/redesignComponents/foundations/Icons";
import { useLayoutShell } from "@/redesignComponents/Layout/LayoutShell.provider";
import Badge from "@/redesignComponents/status/Badge/Badge";
import NumberBadge from "@/redesignComponents/status/Badge/NumberBadge";
import {
  getSideNavInputMethod,
  getSideNavOpenMode,
  SIDE_NAV_TOOLTIP_DWELL_MS,
  SideNavItem,
  SideNavTooltipTrigger,
  toSideNavState,
  trackSideNavItemClicked,
  trackSideNavTooltipViewed
} from "@/utils/analytics/sideNavigationAnalytics";

import { useIsRouteActive } from "./useIsRouteActive";

export interface SideNavigationLinkItemProps {
  navItem?: SideNavItem;
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
  navItem,
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
  const router = useRouter();
  const { resetPage } = useLayoutShell();
  const isAdmin = useIsAdmin();
  const userRole = isAdmin ? "admin" : "project-developer";
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const clearTooltipTimer = useCallback(() => {
    clearTimeout(tooltipTimer.current);
    tooltipTimer.current = undefined;
  }, []);

  // The tooltip only counts as viewed once it has stayed visible for the dwell time.
  const startTooltipTimer = (tooltipTrigger: SideNavTooltipTrigger) => {
    if (navItem == null || !isCollapsed || tooltipTimer.current != null) return;

    tooltipTimer.current = setTimeout(
      () => trackSideNavTooltipViewed({ navItem, tooltipTrigger, userRole }),
      SIDE_NAV_TOOLTIP_DWELL_MS
    );
  };

  useEffect(() => clearTooltipTimer, [clearTooltipTimer]);

  useEffect(() => {
    if (!isCollapsed) clearTooltipTimer();
  }, [isCollapsed, clearTooltipTimer]);

  const handleFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    if (event.currentTarget.matches(":focus-visible")) startTooltipTimer("focus");
  };

  const trackItemClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (navItem == null) return;

    trackSideNavItemClicked({
      navItem,
      navState: toSideNavState(isCollapsed),
      inputMethod: getSideNavInputMethod(event),
      isActiveItem: isActive,
      openMode: getSideNavOpenMode(event),
      userRole
    });
  };

  // Middle-click never fires onClick, only auxclick.
  const handleLinkAuxClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button === 1) trackItemClick(event);
  };

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackItemClick(event);
    if (router.pathname !== href.split("?")[0]) return;
    event.preventDefault();
    resetPage();
    void router.replace(href, undefined, { shallow: true });
  };

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
          onClick={handleLinkClick}
          onAuxClick={handleLinkAuxClick}
          onMouseEnter={() => startTooltipTimer("hover")}
          onMouseLeave={clearTooltipTimer}
          onFocus={handleFocus}
          onBlur={clearTooltipTimer}
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
