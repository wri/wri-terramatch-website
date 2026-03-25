import { Flex, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { twMerge } from "tailwind-merge";

import ButtonGroup, { ButtonGroupProps } from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";

interface MapPlaceholderProps {
  className?: string;
  icon?: React.ReactNode;
  title: string;
  buttonGroupProps?: ButtonGroupProps;
}
export const MapPlaceholder: FC<MapPlaceholderProps> = ({ className, icon, title, buttonGroupProps }) => {
  const { className: buttonGroupClassName, ...rest } = buttonGroupProps ?? {};
  return (
    <Flex
      className={twMerge(
        "absolute inset-0 z-50 h-full w-full flex-col items-center justify-center gap-2 bg-map-sites-placeholder bg-cover bg-center",
        className
      )}
    >
      <Flex className="absolute inset-0 bg-[rgba(3,34,48,0.40)]" />
      <Flex className="relative z-[1] items-center" gap={2}>
        {icon}
        <Text textStyle="600" color="neutral.100">
          {title}
        </Text>
      </Flex>
      <ButtonGroup className={twMerge("!w-fit !border-0 !bg-transparent !p-0", buttonGroupClassName)} {...rest} />
    </Flex>
  );
};

export default MapPlaceholder;
