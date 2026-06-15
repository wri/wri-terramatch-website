import { Flex, Text } from "@chakra-ui/react";
import React, { FC, Fragment, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import { InfoIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

import { wrapToolbarInfoTooltipContent } from "./ToolbarInfoTooltipContent";

interface FloatingActionToolbarProps {
  className?: string;
  items: {
    label: string;
    onClick: () => void;
    labelColor?: string;
    disabled?: boolean;
    infoTooltip?: ReactNode;
  }[];
}

const FloatingActionToolbar: FC<FloatingActionToolbarProps> = ({ items, className }) => {
  return (
    <Flex className={twMerge("w-fit items-center gap-2 rounded-full px-6 py-2.5", className)}>
      {items.map(({ label, onClick, labelColor = "neutral.900", disabled = false, infoTooltip }, index) => (
        <Fragment key={label}>
          <Flex alignItems="center" gap={1.5}>
            <Button variant="borderless" onClick={onClick} disabled={disabled}>
              <Text textStyle="400-bold" color={labelColor}>
                {label}
              </Text>
            </Button>
            {infoTooltip != null && (
              <Tooltip content={wrapToolbarInfoTooltipContent(infoTooltip)} position="top">
                <InfoIcon height="1rem" width="1rem" color="neutral.800" />
              </Tooltip>
            )}
          </Flex>
          {index < items.length - 1 && (
            <SimpleDivider backgroundColor="neutral.500" height="0.875rem" variant="vertical" />
          )}
        </Fragment>
      ))}
    </Flex>
  );
};

export default FloatingActionToolbar;
