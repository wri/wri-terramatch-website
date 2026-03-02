import { FC } from "react";
import { twMerge } from "tailwind-merge";

import { TabType } from "./formNavigation.constants";
import { getBadgeClasses, getBadgeContent } from "./formNavigation.utils";

interface NavigationTabBadgeProps {
  type: TabType;
  isSelected: boolean;
  index: number;
}

export const NavigationTabBadge: FC<NavigationTabBadgeProps> = ({ type, isSelected, index }) => {
  return (
    <div className={twMerge("shrink-0", getBadgeClasses(type, isSelected))}>
      {getBadgeContent(type, index + 1, isSelected)}
    </div>
  );
};
