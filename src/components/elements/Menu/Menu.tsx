import classNames from "classnames";
import { ReactNode, useEffect, useRef, useState } from "react";
import React from "react";

import { MenuItem } from "../MenuItem/MenuItem";
import { MENU_ITEM_VARIANT_BLUE } from "../MenuItem/MenuItemVariant";
import { MENU_PLACEMENT_BOTTOM_RIGHT, MENU_PLACEMENT_LEFT_BOTTOM, MENU_PLACEMENT_RIGHT_TOP } from "./MenuVariant";

interface MenuItemProps {
  id: string;
  render: () => ReactNode;
  MenuItemVariant?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export interface MenuProps {
  menu: MenuItemProps[];
  setSelected?: (id: string) => void;
  isDefaultOpen?: boolean;
  placement?: string;
  variant?: string;
  menuItemVariant?: string;
  children: ReactNode;
  className?: string;
  container?: HTMLDivElement | null;
}

const Menu = (props: MenuProps) => {
  const {
    menu,
    placement = MENU_PLACEMENT_BOTTOM_RIGHT,
    menuItemVariant = MENU_ITEM_VARIANT_BLUE,
    variant,
    children,
    isDefaultOpen,
    className,
    container
  } = props;
  const [isOpen, setIsOpen] = useState(isDefaultOpen);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hideMenu = () => {
      if (menuContainerRef.current) {
        setIsOpen(false);
      }
    };
    container?.addEventListener("scroll", hideMenu);
    window.addEventListener("scroll", hideMenu);
    hideMenu();

    return () => {
      container?.addEventListener("scroll", hideMenu);
      window.removeEventListener("scroll", hideMenu);
    };
  }, [container]);

  const calculateMenuStyleForBottom = () => {
    if (!menuContainerRef.current) {
      return {};
    }
    const rect = menuContainerRef.current.getBoundingClientRect();
    const top = rect.top;
    const height = rect.height;
    const width = rect.width;
    return {
      top: top + height,
      marginTop: "5px",
      minWidth: width
    };
  };

  const calculateMenuStyleForHorizontalTop = () => {
    if (!menuContainerRef.current) {
      return {};
    }
    if (!menuRef.current) {
      return {};
    }
    const bottom = menuContainerRef.current.getBoundingClientRect().bottom;
    const heightMenu = menuRef.current.getBoundingClientRect().height;

    return {
      top: bottom - heightMenu
    };
  };

  const calculateMenuStyleForHorizontalBottom = () => {
    if (!menuContainerRef.current) {
      return {};
    }
    const top = menuContainerRef.current.getBoundingClientRect().top ?? 0;
    return {
      top: top
    };
  };

  const calculateMenuStyle = () => {
    const placeMap: { [key: string]: string } = {
      [MENU_PLACEMENT_RIGHT_TOP]: "horizontalTop",
      [MENU_PLACEMENT_LEFT_BOTTOM]: "hotizontalBottom"
    };

    const place = placeMap[placement] || "bottom";
    let styles;
    switch (place) {
      case "horizontalTop":
        styles = calculateMenuStyleForHorizontalTop();
        break;
      case "hotizontalBottom":
        styles = calculateMenuStyleForHorizontalBottom();
        break;
      default:
        styles = calculateMenuStyleForBottom();
        break;
    }

    return styles;
  };

  return (
    <div
      ref={menuContainerRef}
      className={classNames(className, "relative w-fit-content")}
      onClick={() => setIsOpen(!isOpen)}
    >
      {children}
      <div
        className={`absolute z-40 ${placement} ${isOpen ? "visible" : "invisible"}`}
        style={{ width: `${menuRef.current?.clientWidth}px` }}
      >
        <div
          ref={menuRef}
          className={`fixed z-40 flex flex-col gap-1 overflow-auto rounded-lg bg-white p-2 shadow-[0_0_5px_0_rgba(0,0,0,0.2)] ${variant}`}
          style={calculateMenuStyle()}
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
      </div>
    </div>
  );
};
export default Menu;
