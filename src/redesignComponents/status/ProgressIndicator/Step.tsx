import { Button, Flex, Text } from "@chakra-ui/react";
import classNames from "classnames";
import { FC } from "react";

import {
  BADGE_FOCUS_RING_CLASSES,
  FORCED_FOCUS_CLASSES,
  STEP_STATUS_HOVER_STYLE_MAP,
  STEP_STATUS_PRESSED_STYLE_MAP
} from "@/redesignComponents/navigation/FormNavigation/formNavigation.constants";
import {
  getStepBadgeClasses,
  getStepBadgeContent,
  getStepLabelStyle
} from "@/redesignComponents/navigation/FormNavigation/formNavigation.utils";

import { StepProps } from "./types";

export const Step: FC<StepProps> = props => {
  const { index, status, label, actions, onClick, isFocused, isHovered, isPressed } = props;

  return (
    <Flex gap={3} alignItems="center" justify="space-between">
      <Button
        alignItems="center"
        gap={2}
        disabled={status === "disabled"}
        onClick={onClick}
        tabIndex={-1}
        className="group focus-visible:outline-none"
      >
        <div
          role="button"
          tabIndex={status === "disabled" ? -1 : 0}
          aria-disabled={status === "disabled"}
          className={classNames(
            getStepBadgeClasses(status),
            BADGE_FOCUS_RING_CLASSES,
            isFocused && FORCED_FOCUS_CLASSES,
            isHovered && STEP_STATUS_HOVER_STYLE_MAP[status],
            isPressed && STEP_STATUS_PRESSED_STYLE_MAP[status]
          )}
        >
          {getStepBadgeContent(status, index)}
        </div>
        <Text fontSize="16px" lineHeight="24px" {...getStepLabelStyle(status)}>
          {label}
        </Text>
      </Button>
      {actions}
    </Flex>
  );
};
