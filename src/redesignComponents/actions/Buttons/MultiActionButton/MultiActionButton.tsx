import { Group, Menu, MenuContent, MenuItem, MenuPositioner, MenuTrigger, Portal } from "@chakra-ui/react";
import clsx from "clsx";
import { FC, ReactNode, useState } from "react";

import { ChevronDownIcon } from "@/redesignComponents/foundations/Icons";

import Button from "../Button/Button";
import { secondaryTextColorClass } from "./MultiActionButton.styles";

type MenuTriggerTyped = {
  children: ReactNode;
  asChild?: boolean;
};

type MenuContainerTyped = {
  children: ReactNode;
  minW?: string;
};

type MenuItemTyped = {
  children: ReactNode;
  value?: string;
  color?: string;
  opacity?: number;
  cursor?: string;
  disabled?: boolean;
  onClick?: () => void;
};

const TypedMenuTrigger = MenuTrigger as FC<MenuTriggerTyped>;
const TypedMenuPositioner = MenuPositioner as FC<MenuContainerTyped>;
const TypedMenuContent = MenuContent as FC<MenuContainerTyped>;
const TypedMenuItem = MenuItem as FC<MenuItemTyped>;

export interface IMultiActionOtherAction {
  label: React.ReactNode;
  value: string;
  onClick: VoidFunction;
  disabled?: boolean;
}

export interface IMultiActionButtonProps {
  variant?: "primary" | "secondary";
  size?: "default" | "small";
  mainActionLabel: string;
  mainActionOnClick: VoidFunction;
  otherActions: IMultiActionOtherAction[];
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  className?: string;
}

const MultiActionButton: FC<IMultiActionButtonProps> = ({
  variant = "primary",
  size = "default",
  mainActionLabel,
  mainActionOnClick,
  otherActions,
  disabled = false,
  leftIcon,
  className
}) => {
  const [open, setOpen] = useState(false);
  const buttonClassName = clsx(className, variant === "secondary" && secondaryTextColorClass);

  return (
    <Group attached className={buttonClassName}>
      <Button
        variant={variant}
        size={size}
        onClick={mainActionOnClick}
        disabled={disabled}
        leftIcon={leftIcon}
        className="min-w-0 flex-1"
      >
        {mainActionLabel}
      </Button>
      <Menu.Root
        open={open}
        onOpenChange={(details: { open: boolean }) => setOpen(details.open)}
        positioning={{ placement: "bottom-end" }}
      >
        <TypedMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            disabled={disabled}
            aria-label={`Open ${mainActionLabel} options`}
            aria-haspopup="menu"
            aria-expanded={open}
            className="!px-2"
          >
            <ChevronDownIcon
              boxSize={4}
              transform={open ? "rotate(180deg)" : "rotate(0deg)"}
              transition="transform 0.2s"
            />
          </Button>
        </TypedMenuTrigger>
        <Portal>
          <TypedMenuPositioner>
            <TypedMenuContent minW="10rem">
              {otherActions.map(action => (
                <TypedMenuItem
                  key={action.value}
                  value={action.value}
                  disabled={action.disabled}
                  onClick={action.disabled ? undefined : action.onClick}
                  color="neutral.900"
                  opacity={action.disabled ? 0.5 : 1}
                  cursor={action.disabled ? "not-allowed" : "pointer"}
                >
                  {action.label}
                </TypedMenuItem>
              ))}
            </TypedMenuContent>
          </TypedMenuPositioner>
        </Portal>
      </Menu.Root>
    </Group>
  );
};

export default MultiActionButton;
