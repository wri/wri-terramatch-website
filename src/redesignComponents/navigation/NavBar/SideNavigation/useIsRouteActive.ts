import { usePathname } from "next/navigation";

export const isRouteActive = (currentPath: string, route: string) =>
  currentPath === route || currentPath.startsWith(`${route}/`);

const useCurrentPath = () => {
  const pathname = usePathname();
  const hash = typeof window !== "undefined" ? window.location.hash : "";

  if (pathname != null) {
    return `${pathname}${hash}`;
  }
  return typeof window !== "undefined" ? `${window.location.pathname}${hash}` : "";
};

export const useIsRouteActive = (href: string, activePaths?: string[]) => {
  const currentPath = useCurrentPath();
  return (activePaths ?? [href]).some(route => isRouteActive(currentPath, route));
};
