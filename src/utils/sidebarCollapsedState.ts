import { destroyCookie, parseCookies, setCookie } from "nookies";

// A session cookie (no maxAge) is shared by every tab and survives reloads, but the browser drops it on close,
// so the side navigation starts expanded again after a browser restart.
const SIDEBAR_COLLAPSED_COOKIE = "sidebarCollapsed";

export const getSidebarCollapsed = () => parseCookies(null)[SIDEBAR_COLLAPSED_COOKIE] === "true";

export const setSidebarCollapsed = (collapsed: boolean) => {
  if (collapsed) {
    setCookie(null, SIDEBAR_COLLAPSED_COOKIE, "true", { path: "/", sameSite: "lax" });
  } else {
    clearSidebarCollapsed();
  }
};

export const clearSidebarCollapsed = () => {
  destroyCookie(null, SIDEBAR_COLLAPSED_COOKIE, { path: "/" });
};
