import { MutableRefObject } from "react";
import { twMerge as tw } from "tailwind-merge";

import { MENU_ITEM_VARIANT_BLUE } from "./MenuItemVariant";
export interface MenuItemProps {
  render: string;
  MenuItemVariant?: string;
  className?: string;
  onClick?: any;
  ref?: MutableRefObject<HTMLDivElement | null>;
}
export const MenuItem = (props: MenuItemProps) => {
  const { MenuItemVariant = MENU_ITEM_VARIANT_BLUE, onClick, render, className } = props;
  return (
    <button onClick={onClick} className={tw(MenuItemVariant, className)}>
      {render}
    </button>
  );
};
