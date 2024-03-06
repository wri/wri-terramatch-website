import { ReactNode } from "react";
import { When } from "react-if";

import { MenuItem } from "../MenuItem/MenuItem";
import { MENU_ITEM_VARIANT_BLUE } from "../MenuItem/MenuItemVariant";
import { MENU_PLACEMENT_BOTTOM_RIGHT } from "./MenuVariant";

interface MenuItemProps {
  id: string;
  render: () => ReactNode;
  MenuItemVariant?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export interface MenuProps {
  menu: MenuItemProps[];
  setSelected?: (id: string) => void;
  isOpen: boolean;
  placement?: string;
  variant?: string;
  menuItemVariant?: string;
}

const Menu = (props: MenuProps) => {
  const {
    menu,
    isOpen,
    placement = MENU_PLACEMENT_BOTTOM_RIGHT,
    menuItemVariant = MENU_ITEM_VARIANT_BLUE,
    variant
  } = props;
  return (
    <When condition={isOpen}>
      <div
        className={`absolute z-10 flex min-w-full flex-col gap-1 overflow-auto rounded-lg bg-white p-2 shadow-[0_0_5px_0_rgba(0,0,0,0.2)] ${placement} ${variant}`}
      >
        {menu.map(item => (
          <MenuItem
            MenuItemVariant={item.MenuItemVariant ?? menuItemVariant}
            key={item.id}
            render={item.render}
            onClick={item.onClick}
          />
        ))}
      </div>
    </When>
  );
};
export default Menu;
