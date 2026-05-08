import { MultiActionButton as WriMultiActionButton } from "@worldresources/wri-design-systems";
import clsx from "clsx";
import { FC } from "react";

import { secondaryTextColorClass } from "./MultiActionButton.styles";

export interface IMultiActionButtonProps {
  variant?: "primary" | "secondary";
  size?: "default" | "small";
  mainActionLabel: string;
  mainActionOnClick: VoidFunction;
  otherActions: {
    label: React.ReactNode;
    value: string;
    onClick: VoidFunction;
  }[];
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  className?: string;
}

const MultiActionButton: FC<IMultiActionButtonProps> = ({
  variant,
  size,
  mainActionLabel,
  mainActionOnClick,
  otherActions,
  disabled,
  className,
  ...props
}) => {
  const buttonClassName = clsx(className, variant === "secondary" && secondaryTextColorClass);
  return (
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
};

export default MultiActionButton;
