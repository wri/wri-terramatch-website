import { useCallback, useState } from "react";

interface UseFormNavigationProps {
  defaultValue?: string;
  defaultTabValue?: string;
  onTabClick?: (selectedValue: string) => void;
  onOpenChange?: (open: boolean) => void;
}

export const useFormNavigation = (props: UseFormNavigationProps) => {
  const { defaultValue, defaultTabValue, onTabClick, onOpenChange } = props;

  const [hideSidebar, setHideSidebar] = useState(false);
  const [selectedTab, setSelectedTab] = useState(defaultValue ?? defaultTabValue ?? "");

  const handleTabClick = useCallback(
    (selectedValue: string) => {
      setSelectedTab(selectedValue);
      onTabClick?.(selectedValue);
    },
    [onTabClick]
  );

  const handleSidebarToggle = useCallback(
    ({ open }: { open: boolean }) => {
      setHideSidebar(open);
      onOpenChange?.(!open);
    },
    [onOpenChange]
  );

  return {
    hideSidebar,
    selectedTab,
    handleTabClick,
    handleSidebarToggle
  };
};
