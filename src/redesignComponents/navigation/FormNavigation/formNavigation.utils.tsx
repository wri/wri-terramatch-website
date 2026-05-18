import classNames from "classnames";
import { ReactNode } from "react";

import { CheckIcon, InformationRequiredSimpleIcon } from "@/redesignComponents/foundations/Icons";

import { BadgeStatus, NAVIGATION_CLASSES, TabType } from "./formNavigation.constants";

export const getBadgeClasses = (type: TabType, isSelected: boolean): string => {
  return classNames(NAVIGATION_CLASSES.badge.base, {
    [NAVIGATION_CLASSES.badge.complete]: type === "complete" || isSelected,
    [NAVIGATION_CLASSES.badge.available]: type === "available",
    [NAVIGATION_CLASSES.badge.disabled]: type === "disabled",
    [NAVIGATION_CLASSES.badge.warning]: type === "warning",
    [NAVIGATION_CLASSES.badge.error]: type === "error"
  });
};

export const getLabelClasses = (isSelected: boolean): string => {
  return classNames({
    [NAVIGATION_CLASSES.label.default]: !isSelected,
    [NAVIGATION_CLASSES.label.selected]: isSelected
  });
};

export const getNumberClasses = (type: TabType, isSelected: boolean): string => {
  return classNames(NAVIGATION_CLASSES.number.base, {
    [NAVIGATION_CLASSES.number.selected]: isSelected,
    [NAVIGATION_CLASSES.number.default]: type === "available" || type === "disabled"
  });
};

export const getTabClasses = (isSelected: boolean): string => {
  return classNames(NAVIGATION_CLASSES.tab.base);
};

export const shouldShowNumber = (type: TabType, isSelected: boolean): boolean => {
  return (isSelected || type === "available" || type === "disabled") && type !== "complete";
};

const mapStatusToTabType = (status: BadgeStatus): TabType => {
  const typeMap: Record<BadgeStatus, TabType> = {
    completed: "complete",
    active: "complete",
    available: "available",
    disabled: "disabled",
    error: "error",
    warning: "warning"
  };
  return typeMap[status];
};

export const getStepBadgeClasses = (status: BadgeStatus): string => {
  const type = mapStatusToTabType(status);
  return classNames(NAVIGATION_CLASSES.badge.base, {
    [NAVIGATION_CLASSES.badge.complete]: type === "complete",
    [NAVIGATION_CLASSES.badge.available]: type === "available",
    [NAVIGATION_CLASSES.badge.disabled]: type === "disabled",
    [NAVIGATION_CLASSES.badge.warning]: type === "warning",
    [NAVIGATION_CLASSES.badge.error]: type === "error"
  });
};

export const getBadgeContent = (
  type: TabType,
  index: number,
  isSelected: boolean = false,
  showNumberForActive: boolean = false
): ReactNode => {
  const numberBadge = <div className={getNumberClasses(type, isSelected)}>{index}</div>;

  if (type === "warning" || type === "error") {
    return <InformationRequiredSimpleIcon boxSize={4} />;
  }

  if (showNumberForActive) {
    return numberBadge;
  }

  if (type === "complete") {
    return <CheckIcon boxSize={4} />;
  }

  if (shouldShowNumber(type, isSelected)) {
    return numberBadge;
  }

  return null;
};

export const getStepBadgeContent = (status: BadgeStatus, index: number): ReactNode => {
  const type = mapStatusToTabType(status);
  const showNumberForActive = status === "active";
  const isSelected = status === "active";

  return getBadgeContent(type, index, isSelected, showNumberForActive);
};

export const getStepLabelStyle = (status: BadgeStatus): { color: string; fontWeight?: string } => {
  switch (status) {
    case "completed":
      return { color: "neutral.700" };
    case "active":
      return { color: "primary.900", fontWeight: "bold" };
    case "available":
      return { color: "neutral.700" };
    case "disabled":
      return { color: "neutral.600" };
    case "error":
      return { color: "error.900" };
    case "warning":
      return { color: "warning.900" };
    default:
      return { color: "neutral.600" };
  }
};
