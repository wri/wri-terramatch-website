import { Flex } from "@chakra-ui/react";
import React, { FC } from "react";
import { twMerge } from "tailwind-merge";

import Button, { IButtonProps } from "../Button/Button";

export type ButtonGroupButtonProps = IButtonProps & { id: string };

export type ButtonGroupItem = {
  id: string;
  buttons: ButtonGroupButtonProps[];
};

export interface ButtonGroupProps {
  className?: string;
  buttons?: ButtonGroupButtonProps[];
  groups?: ButtonGroupItem[];
}

const ButtonGroup: FC<ButtonGroupProps> = ({ className, buttons = [], groups = [] }) => {
  return (
    <Flex
      className={className}
      width="100%"
      borderTop="0.0625rem solid"
      borderColor="neutral.300"
      py={3}
      px={4}
      bg="neutral.100"
      gap={3}
      justifyContent={buttons.length > 0 ? "flex-start" : "space-between"}
    >
      {buttons.map((button, index) => (
        <Button key={button.id ?? `button-${index}`} className={twMerge(button.className, "flex-1")} {...button} />
      ))}
      {groups.map((group, groupIndex) => (
        <Flex key={group.id ?? `group-${groupIndex}`} gap={3}>
          {group.buttons.map((button, index) => (
            <Button key={button.id ?? `${group.id ?? groupIndex}-button-${index}`} {...button} />
          ))}
        </Flex>
      ))}
    </Flex>
  );
};

export default ButtonGroup;
