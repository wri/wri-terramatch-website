import { Box, Flex } from "@chakra-ui/react";
import {
  MultiActionButton as WriMultiActionButton,
  MultiActionButtonProps as WriMultiActionButtonProps
} from "@worldresources/wri-design-systems";
import clsx from "clsx";
import { FC } from "react";

import { darkTypeVariantCss, fullWidthGroupCss, secondaryTextColorClass } from "./MultiActionButton.styles";

export interface IMultiActionButtonProps extends WriMultiActionButtonProps {
  className?: string;
  isFullWidth?: boolean;
  typeVariant?: "light" | "dark";
}

const MultiActionButton: FC<IMultiActionButtonProps> = ({
  variant,
  size,
  mainActionLabel,
  mainActionOnClick,
  otherActions,
  disabled,
  className,
  isFullWidth = false,
  typeVariant = "light",
  ...props
}) => {
  const isDark = typeVariant === "dark";
  const buttonClassName = clsx(
    className,
    variant === "secondary" && !disabled && !isDark && secondaryTextColorClass,
    isFullWidth && "flex-auto"
  );
  const button = (
    <WriMultiActionButton
      variant={variant}
      size={size}
      className={buttonClassName}
      mainActionLabel={mainActionLabel}
      mainActionOnClick={mainActionOnClick}
      otherActions={otherActions}
      disabled={disabled}
      {...props}
    />
  );

  if (isFullWidth) {
    return (
      <Flex flex="1 1 auto" css={isDark ? { ...fullWidthGroupCss, ...darkTypeVariantCss } : fullWidthGroupCss}>
        {button}
      </Flex>
    );
  }

  return isDark ? <Box css={darkTypeVariantCss}>{button}</Box> : button;
};

export default MultiActionButton;
