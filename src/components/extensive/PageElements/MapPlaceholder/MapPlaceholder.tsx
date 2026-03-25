import { Flex, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { twMerge } from "tailwind-merge";

import Button, { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";

interface MapPlaceholderProps {
  className?: string;
  icon?: React.ReactNode;
  title: string;
  buttonProps?: IButtonProps;
}
export const MapPlaceholder: FC<MapPlaceholderProps> = ({ className, icon, title, buttonProps }) => {
  const {
    variant = "borderless",
    size = "small",
    rightIcon = <ChevronRightIcon boxSize={4} />,
    className: buttonClassName,
    ...rest
  } = buttonProps ?? {};
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
      <Button
        variant={variant}
        size={size}
        rightIcon={rightIcon}
        className={twMerge("!text-theme-neutral-100 relative z-[1]", buttonClassName)}
        {...rest}
      />
    </Flex>
  );
};

export default MapPlaceholder;
