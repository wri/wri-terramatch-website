import { ReactNode } from "react";

export interface MenuTriggerTyped {
  children: ReactNode;
  asChild?: boolean;
}

export interface MenuContainerTyped {
  children: ReactNode;
}

export interface MenuItemTyped {
  children: ReactNode;
  value?: string;
  textStyle?: string;
  color?: string;
  onClick?: () => void;
}

export interface MenuItemOption {
  label: string;
  value: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
}

export interface MenuCustomProps {
  label?: string;
  items: MenuItemOption[];
  customTrigger?: ReactNode;
}
