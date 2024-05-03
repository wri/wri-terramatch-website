import { MutableRefObject } from "react";
import { twMerge as tw } from "tailwind-merge";

import { MENU_ITEM_VARIANT_BLUE } from "./MenuItemVariant";
export interface MenuItemProps {
  render: string;
  MenuItemVariant?: string;
  className?: string;
  onClick?: any;
  selected?: boolean;
  ref?: MutableRefObject<HTMLDivElement | null>;
}
export const MenuItem = (props: MenuItemProps) => {
  const { MenuItemVariant = MENU_ITEM_VARIANT_BLUE, onClick, render, className, selected } = props;
  return (
    <button onClick={onClick} className={tw(MenuItemVariant, className, selected ? "bg-primary-200 text-primary" : "")}>
      {render}
    </button>
  );
};
