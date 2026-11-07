import { Flex } from "@chakra-ui/react";
import {
  MultiActionButton as WriMultiActionButton,
  MultiActionButtonProps as WriMultiActionButtonProps
} from "@worldresources/wri-design-systems";
import clsx from "clsx";
import { FC } from "react";

import { fullWidthGroupCss, secondaryTextColorClass } from "./MultiActionButton.styles";

export interface IMultiActionButtonProps extends WriMultiActionButtonProps {
  className?: string;
  isFullWidth?: boolean;
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
  ...props
}) => {
  const buttonClassName = clsx(
    className,
    variant === "secondary" && secondaryTextColorClass,
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

  return isFullWidth ? (
    <Flex flex="1 1 auto" css={fullWidthGroupCss}>
      {button}
    </Flex>
  ) : (
    button
  );
};

export default MultiActionButton;
