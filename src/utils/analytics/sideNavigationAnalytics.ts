import type { KeyboardEvent, MouseEvent } from "react";

import { PAGE_CONTEXT_SIDE_NAVIGATION } from "@/utils/analytics/pageContext";
import { SideNavigationEventName, trackSideNavigationEvent } from "@/utils/ga4";

export type SideNavItem = "organization" | "projects" | "sites" | "nurseries" | "reports" | "opportunities";
export type SideNavState = "expanded" | "collapsed";
export type SideNavInputMethod = "mouse" | "keyboard" | "touch";
export type SideNavOpenMode = "same_tab" | "new_tab";
export type SideNavTooltipTrigger = "hover" | "focus";
export type SideNavUserRole = "admin" | "project-developer";

export const SIDE_NAV_TOOLTIP_DWELL_MS = 300;

const VISIBLE_ITEMS_MAX_LENGTH = 100;

let sideNavDisplayedTracked = false;

const trackEvent = (eventName: SideNavigationEventName, params: Record<string, string | number | boolean>): void => {
  trackSideNavigationEvent(eventName, { page_context: PAGE_CONTEXT_SIDE_NAVIGATION, ...params });
};

export const toSideNavState = (collapsed: boolean): SideNavState => (collapsed ? "collapsed" : "expanded");

export const getSideNavInputMethod = (event: MouseEvent | KeyboardEvent): SideNavInputMethod => {
  if (event.type.startsWith("key")) return "keyboard";

  const { pointerType, detail } = event.nativeEvent as PointerEvent;
  if (pointerType === "touch") return "touch";
  // A click without pointer movement (detail 0) comes from Enter / Space on a focused control.
  if (detail === 0) return "keyboard";

  return "mouse";
};

export const getSideNavOpenMode = (event: MouseEvent): SideNavOpenMode =>
  event.ctrlKey || event.metaKey || event.button === 1 ? "new_tab" : "same_tab";

export const trackSideNavDisplayedOnce = ({
  navState,
  visibleItems,
  userRole
}: {
  navState: SideNavState;
  visibleItems: SideNavItem[];
  userRole: SideNavUserRole;
}): void => {
  if (sideNavDisplayedTracked) return;
  sideNavDisplayedTracked = true;

  trackEvent("side_nav_displayed", {
    nav_state: navState,
    visible_items: [...visibleItems].sort().join("|").slice(0, VISIBLE_ITEMS_MAX_LENGTH),
    visible_item_count: visibleItems.length,
    user_role: userRole
  });
};

export const trackSideNavToggled = ({
  navAction,
  inputMethod,
  userRole
}: {
  navAction: SideNavState;
  inputMethod: SideNavInputMethod;
  userRole: SideNavUserRole;
}): void => {
  trackEvent("side_nav_toggled", { nav_action: navAction, input_method: inputMethod, user_role: userRole });
};

export const trackSideNavItemClicked = ({
  navItem,
  navState,
  inputMethod,
  isActiveItem,
  openMode,
  userRole
}: {
  navItem: SideNavItem;
  navState: SideNavState;
  inputMethod: SideNavInputMethod;
  isActiveItem: boolean;
  openMode: SideNavOpenMode;
  userRole: SideNavUserRole;
}): void => {
  trackEvent("side_nav_item_clicked", {
    nav_item: navItem,
    nav_state: navState,
    input_method: inputMethod,
    is_active_item: isActiveItem,
    open_mode: openMode,
    user_role: userRole
  });
};

export const trackSideNavTooltipViewed = ({
  navItem,
  tooltipTrigger,
  userRole
}: {
  navItem: SideNavItem;
  tooltipTrigger: SideNavTooltipTrigger;
  userRole: SideNavUserRole;
}): void => {
  trackEvent("side_nav_tooltip_viewed", { nav_item: navItem, tooltip_trigger: tooltipTrigger, user_role: userRole });
};
