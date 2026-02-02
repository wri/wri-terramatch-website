import { Button, Flex, Text } from "@chakra-ui/react";
import classNames from "classnames";
import { FC } from "react";

import { BADGE_FOCUS_RING_CLASSES } from "@/redesignComponents/navigation/FormNavigation/formNavigation.constants";
import {
  getStepBadgeClasses,
  getStepBadgeContent,
  getStepLabelStyle
} from "@/redesignComponents/navigation/FormNavigation/formNavigation.utils";

import { StepProps } from "./types";

export const Step: FC<StepProps> = props => {
  const { index, status, label, actions, onClick } = props;

  return (
    <Flex gap={3} alignItems="center" justify="space-between">
      <Button
        alignItems="center"
        gap={2}
        disabled={status === "disabled"}
        onClick={onClick}
        tabIndex={-1}
        className="group"
      >
        <Flex
          as="button"
          role="button"
          tabIndex={status === "disabled" ? -1 : 0}
          onClick={status === "disabled" ? undefined : onClick}
          aria-disabled={status === "disabled"}
          className={classNames(getStepBadgeClasses(status), BADGE_FOCUS_RING_CLASSES)}
        >
          {getStepBadgeContent(status, index)}
        </Flex>
        <Text fontSize="16px" lineHeight="24px" {...getStepLabelStyle(status)}>
          {label}
        </Text>
      </Button>
      {actions}
    </Flex>
  );
};
