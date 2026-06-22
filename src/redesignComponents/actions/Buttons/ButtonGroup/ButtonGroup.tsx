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
  buttons?: IButtonProps[];
  classNameGroup?: string;
  groups?: { id: string; buttons: IButtonProps[] }[];
}
const ButtonGroup: FC<ButtonGroupProps> = ({ className, buttons = [], groups = [], classNameGroup }) => {
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
      {buttons.map(button => (
        <Button key={button.id} className={twMerge(button.className, "flex-1")} {...button} />
      ))}
      {groups.map(group => (
        <Flex key={group.id} gap={3} className={classNameGroup}>
          {group.buttons.map(button => (
            <Button key={button.id} {...button} />
          ))}
        </Flex>
      ))}
    </Flex>
  );
};

export default ButtonGroup;
