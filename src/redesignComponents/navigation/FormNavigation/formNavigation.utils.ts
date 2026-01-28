import classNames from "classnames";

import { NAVIGATION_CLASSES, TabType } from "./formNavigation.constants";

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
