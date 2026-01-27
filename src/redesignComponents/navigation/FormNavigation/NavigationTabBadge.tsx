import { FC } from "react";

import { Check, InformationRequired } from "@/redesignComponents/foundations/Icons";

import { TabType } from "./formNavigation.constants";
import { getBadgeClasses, getNumberClasses, shouldShowNumber } from "./formNavigation.utils";

interface NavigationTabBadgeProps {
  type: TabType;
  isSelected: boolean;
  index: number;
}

export const NavigationTabBadge: FC<NavigationTabBadgeProps> = ({ type, isSelected, index }) => {
  return (
    <div className={getBadgeClasses(type, isSelected)}>
      {type === "error" ? (
        <InformationRequired className="text-theme-error-100 h-[calc(2rem-2px)] w-[calc(2rem-2px)]" />
      ) : (
        <>
          {type === "complete" && <Check className="max-w-4 w-4" />}
          {shouldShowNumber(type, isSelected) && <div className={getNumberClasses(type, isSelected)}>{index + 1}</div>}
        </>
      )}
    </div>
  );
};
