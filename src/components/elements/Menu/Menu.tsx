import classNames from "classnames";
import { ReactNode, useEffect, useRef, useState } from "react";
import React from "react";
import { twMerge as tw } from "tailwind-merge";

import { MenuItem } from "../MenuItem/MenuItem";
import { MENU_ITEM_VARIANT_BLUE } from "../MenuItem/MenuItemVariant";
import {
  MENU_PLACEMENT_BOTTOM_RIGHT,
  MENU_PLACEMENT_LEFT_BOTTOM,
  MENU_PLACEMENT_LEFT_HALF_TOP,
  MENU_PLACEMENT_RIGHT_BOTTOM,
  MENU_PLACEMENT_RIGHT_TOP
} from "./MenuVariant";

export interface MenuItemProps {
  id: string;
  is_airtable?: boolean;
  render: () => ReactNode;
  MenuItemVariant?: string;
  onClick?: (id?: any) => void;
  country_slug?: string | null;
  program?: string | null;
  data?: any;
}
export interface MenuProps {
  extraData?: any;
  menu: MenuItemProps[];
  setSelected?: (id: string) => void;
  isDefaultOpen?: boolean;
  placement?: string;
  variant?: string;
  menuItemVariant?: string;
  children: ReactNode;
  className?: string;
  container?: HTMLDivElement | null;
  setSelectedOption?: any;
  classNameContentMenu?: string;
  selectedOption?: string;
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
    container,
    setSelectedOption,
    classNameContentMenu,
    selectedOption,
    extraData
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
  }, []);
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
      container?.removeEventListener("scroll", hideMenu);
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
    if (menuContainerRef.current == null || menuRef.current == null) {
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

  const calculateMenuStyleForLeftHalfTop = () => {
    if (!menuContainerRef.current || !menuRef.current) {
      return {};
    }
    const rect = menuContainerRef.current.getBoundingClientRect();
    const top = rect.top ?? 0;
    const height = rect.height ?? 0;
    const heightMenu = menuRef.current.getBoundingClientRect().height;
    return {
      top: top - (heightMenu - height)
    };
  };

  const calculateMenuStyle = () => {
    const placeMap: { [key: string]: string } = {
      [MENU_PLACEMENT_RIGHT_TOP]: "horizontalTop",
      [MENU_PLACEMENT_LEFT_BOTTOM]: "horizontalBottom",
      [MENU_PLACEMENT_RIGHT_BOTTOM]: "horizontalBottom",
      [MENU_PLACEMENT_LEFT_HALF_TOP]: "leftHalfTop"
    };

    const place = placeMap[placement] ?? "bottom";
    let styles;
    switch (place) {
      case "horizontalTop":
        styles = calculateMenuStyleForHorizontalTop();
        break;
      case "horizontalBottom":
        styles = calculateMenuStyleForHorizontalBottom();
        break;
      case "leftHalfTop":
        styles = calculateMenuStyleForLeftHalfTop();
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
          className={tw(
            "fixed z-40 flex flex-col gap-1 overflow-auto rounded-lg bg-white p-2 shadow-[0_0_5px_0_rgba(0,0,0,0.2)]",
            variant,
            classNameContentMenu
          )}
          style={calculateMenuStyle()}
        >
          {menu?.map(item => (
            <MenuItem
              MenuItemVariant={item?.MenuItemVariant ?? menuItemVariant}
              selected={setSelectedOption && selectedOption === (item?.country_slug ?? item?.data?.label)}
              key={item?.id}
              render={
                (item?.data?.icon ? (
                  <div className="flex items-center">
                    <img
                      src={`${item?.data?.icon?.toLowerCase()}`}
                      className="mr-2 h-[16.7px] w-[25px] object-cover lg:h-[21.7px] lg:w-[30px] wide:h-[26.7px] wide:w-[35px]"
                      alt="info"
                    />
                    {item?.data?.label}
                  </div>
                ) : (
                  item?.data?.label
                )) ?? item?.render()
              }
              onClick={() => {
                if (item?.onClick) {
                  if (item?.is_airtable) {
                    item?.onClick(extraData);
                  } else {
                    item?.onClick();
                  }
                }
                setSelectedOption?.(item?.country_slug ?? item?.data?.label);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Menu;
