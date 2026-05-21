import { Flex, Text } from "@chakra-ui/react";
import React, { FC, Fragment } from "react";
import { twMerge } from "tailwind-merge";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

interface FloatingActionToolbarProps {
  className?: string;
  items: {
    label: string;
    onClick: () => void;
    labelColor?: string;
  }[];
}

const FloatingActionToolbar: FC<FloatingActionToolbarProps> = ({ items, className }) => {
  return (
    <Flex className={twMerge("w-fit items-center gap-2 rounded-full px-6 py-2.5", className)}>
      {items.map(({ label, onClick, labelColor = "neutral.900" }, index) => (
        <Fragment key={label}>
          <Button variant="borderless" onClick={onClick}>
            <Text textStyle="400-bold" color={labelColor}>
              {label}
            </Text>
          </Button>
          {index < items.length - 1 && (
            <SimpleDivider backgroundColor="neutral.500" height="0.875rem" variant="vertical" />
          )}
        </Fragment>
      ))}
    </Flex>
  );
};

export default FloatingActionToolbar;
