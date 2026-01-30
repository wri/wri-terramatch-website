import classNames from "classnames";
import React, { ReactNode } from "react";

import { Check, InformationRequired } from "@/redesignComponents/foundations/Icons";

import { BadgeStatus, NAVIGATION_CLASSES, TabType } from "./formNavigation.constants";

/**
 * Get badge classes based on tab type and selection state
 */
export const getBadgeClasses = (type: TabType, isSelected: boolean): string => {
  return classNames(NAVIGATION_CLASSES.badge.base, {
    [NAVIGATION_CLASSES.badge.complete]: type === "complete" || isSelected,
    [NAVIGATION_CLASSES.badge.available]: type === "available",
    [NAVIGATION_CLASSES.badge.disabled]: type === "disabled",

    [NAVIGATION_CLASSES.badge.error]: type === "error"
  });
};

/**
 * Get label classes based on selection state
 */
export const getLabelClasses = (isSelected: boolean): string => {
  return classNames({
    [NAVIGATION_CLASSES.label.default]: !isSelected,
    [NAVIGATION_CLASSES.label.selected]: isSelected
  });
};

/**
 * Get number classes based on type and selection state
 */
export const getNumberClasses = (type: TabType, isSelected: boolean): string => {
  return classNames(NAVIGATION_CLASSES.number.base, {
    [NAVIGATION_CLASSES.number.selected]: isSelected,
    [NAVIGATION_CLASSES.number.default]: type === "available" || type === "disabled"
  });
};

/**
 * Get tab trigger classes based on selection state
 */
export const getTabClasses = (isSelected: boolean): string => {
  return classNames(NAVIGATION_CLASSES.tab.base);
};

/**
 * Check if badge should show number
 */
export const shouldShowNumber = (type: TabType, isSelected: boolean): boolean => {
  return (isSelected || type === "available" || type === "disabled") && type !== "complete";
};

/**
 * Map BadgeStatus to TabType
 */
const mapStatusToTabType = (status: BadgeStatus): TabType => {
  const typeMap: Record<BadgeStatus, TabType> = {
    completed: "complete",
    active: "complete",
    available: "available",
    disabled: "disabled",
    error: "error"
  };
  return typeMap[status];
};

/**
 * Get badge classes for Step component based on status
 * Maps Step status to TabType and returns badge classes without selection state
 */
export const getStepBadgeClasses = (status: BadgeStatus): string => {
  const type = mapStatusToTabType(status);
  return classNames(NAVIGATION_CLASSES.badge.base, {
    [NAVIGATION_CLASSES.badge.complete]: type === "complete",
    [NAVIGATION_CLASSES.badge.available]: type === "available",
    [NAVIGATION_CLASSES.badge.disabled]: type === "disabled",
    [NAVIGATION_CLASSES.badge.error]: type === "error"
  });
};

export const getBadgeContent = (
  type: TabType,
  index: number,
  isSelected: boolean = false,
  showNumberForActive: boolean = false
): ReactNode => {
  if (type === "error") {
    return React.createElement(InformationRequired, {
      className:
        "h-[calc(2rem-2px)] w-[calc(2rem-2px)] text-theme-error-100 group-hover:text-theme-error-150 group-active:!text-theme-error-300"
    });
  }

  if (showNumberForActive) {
    return React.createElement("div", { className: getNumberClasses(type, isSelected) }, index);
  }

  if (type === "complete") {
    return React.createElement(Check, { className: "max-w-4 w-4" });
  }

  if (shouldShowNumber(type, isSelected)) {
    return React.createElement("div", { className: getNumberClasses(type, isSelected) }, index);
  }

  return null;
};

/**
 * Get badge content for Step component based on status
 * Maps Step status to TabType and uses shared badge content logic
 */
export const getStepBadgeContent = (status: BadgeStatus, index: number): ReactNode => {
  const type = mapStatusToTabType(status);
  const showNumberForActive = status === "active";
  const isSelected = status === "active";

  return getBadgeContent(type, index, isSelected, showNumberForActive);
};

/**
 * Get label style props for Step component based on status
 */
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
    default:
      return { color: "neutral.600" };
  }
};
