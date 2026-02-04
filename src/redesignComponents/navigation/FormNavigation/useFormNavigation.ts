import { useCallback, useState } from "react";

interface UseFormNavigationProps {
  defaultValue?: string;
  defaultTabValue?: string;
  onTabClick?: (selectedValue: string) => void;
}

export const useFormNavigation = (props: UseFormNavigationProps) => {
  const { defaultValue, defaultTabValue, onTabClick } = props;

  const [selectedTab, setSelectedTab] = useState(defaultValue ?? defaultTabValue ?? "");

  const handleTabClick = useCallback(
    (selectedValue: string) => {
      setSelectedTab(selectedValue);
      onTabClick?.(selectedValue);
    },
    [onTabClick]
  );

  return {
    selectedTab,
    handleTabClick
  };
};
