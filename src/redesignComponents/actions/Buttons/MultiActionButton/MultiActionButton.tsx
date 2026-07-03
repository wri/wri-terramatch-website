import { Box } from "@chakra-ui/react";
import { MultiActionButton as WriMultiActionButton } from "@worldresources/wri-design-systems";
import clsx from "clsx";
import { FC } from "react";

import { getThemedColor } from "@/lib/theme";

import { secondaryTextColorClass } from "./MultiActionButton.styles";

export interface IMultiActionOtherAction {
  label: React.ReactNode;
  value: string;
  onClick: VoidFunction;
  disabled?: boolean;
}

export interface IMultiActionButtonProps {
  variant?: "primary" | "secondary" | "borderless";
  size?: "default" | "small";
  mainActionLabel: string;
  mainActionOnClick: VoidFunction;
  otherActions: IMultiActionOtherAction[];
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  className?: string;
}

const mapOtherActionsForWri = (otherActions: IMultiActionOtherAction[]) =>
  otherActions.map(({ disabled: isActionDisabled, onClick, label, value }) => ({
    label: isActionDisabled ? (
      <span style={{ opacity: 0.4, pointerEvents: "none", cursor: "not-allowed" }}>{label}</span>
    ) : (
      label
    ),
    value,
    disabled: isActionDisabled,
    onClick: isActionDisabled ? () => {} : onClick
  }));

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
  const wriOtherActions = mapOtherActionsForWri(otherActions);

  if (variant === "borderless") {
    return (
      <Box
        css={{
          "& button": {
            boxShadow: "none !important",
            backgroundColor: "transparent",
            border: "none",
            color: `${getThemedColor("neutral", 900)} !important`
          },
          "& button:focus-visible": {
            outlineColor: `${getThemedColor("primary", 700)} !important`
          },
          "& button:active": {
            outline: "none",
            backgroundColor: ` ${getThemedColor("primary", 200)} !important`,
            boxShadow: "0 0.25rem 0.375rem -0.0625rem #0000001A"
          }
        }}
      >
        <WriMultiActionButton
          variant="secondary"
          size={size}
          className={buttonClassName}
          mainActionLabel={mainActionLabel}
          mainActionOnClick={mainActionOnClick}
          otherActions={wriOtherActions}
          disabled={disabled}
          {...props}
        />
      </Box>
    );
  }

  return (
    <WriMultiActionButton
      variant={variant}
      size={size}
      className={buttonClassName}
      mainActionLabel={mainActionLabel}
      mainActionOnClick={mainActionOnClick}
      otherActions={wriOtherActions}
      disabled={disabled}
      {...props}
    />
  );
};

export default MultiActionButton;
