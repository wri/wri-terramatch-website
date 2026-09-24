import { Text } from "@chakra-ui/react";
import classNames from "classnames";
import { ReactNode } from "react";

import { CheckIcon, InformationRequiredSimpleIcon } from "@/redesignComponents/foundations/Icons";

import { BadgeStatus, NAVIGATION_CLASSES, TabType } from "./formNavigation.constants";

export const getBadgeClasses = (type: TabType, isSelected: boolean): string => {
  return classNames(NAVIGATION_CLASSES.badge.base, {
    [NAVIGATION_CLASSES.badge.complete]: type === "complete" || isSelected,
    [NAVIGATION_CLASSES.badge.available]: type === "available",
    [NAVIGATION_CLASSES.badge.disabled]: type === "disabled",
    [NAVIGATION_CLASSES.badge.error]: type === "error"
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
    error: "error"
  };
  return typeMap[status];
};

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
  const numberBadge = (
    <Text textStyle="500-bold" color={isSelected ? "primary.800" : "neutral.700"}>
      {index}
    </Text>
  );

  if (type === "error") {
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
    default:
      return { color: "neutral.600" };
  }
};
