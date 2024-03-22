import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, useState } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import { MenuItem } from "../MenuItem/MenuItem";
import { MENU_ITEM_VARIANT_BLUE } from "../MenuItem/MenuItemVariant";

export interface MapSidePanelItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  uuid: string;
  title: string;
  subtitle: string;
  isSelected?: boolean;
}

const MapSidePanelItem = ({ title, subtitle, isSelected, className, ...props }: MapSidePanelItemProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0 });

  const toggleMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({ left: rect.right, top: rect.top });
    setMenuVisible(!menuVisible);
  };

  const itemsPrimaryMenu = [
    {
      id: "1",
      render: () => (
        <Text variant="text-14-semibold" className="flex">
          <Icon
            name={IconNames.IC_SITE_VIEW}
            className="h-4 w-4 rounded-lg hover:fill-primary hover:text-primary lg:h-5 lg:w-5"
          />
          &nbsp; View Site
        </Text>
      ),
      onClick: () => {}
    },
    {
      id: "2",
      render: () => (
        <Text variant="text-14-semibold" className="flex">
          <Icon
            name={IconNames.SEARCH}
            className="h-4 w-4 rounded-lg hover:fill-primary hover:text-primary lg:h-5 lg:w-5"
          />
          &nbsp;Zoom to
        </Text>
      ),
      onClick: () => {}
    }
  ];

  return (
    <div className="relative">
      <div
        {...props}
        className={classNames(className, " rounded-lg border-2 border-transparent bg-white p-2 hover:border-primary", {
          "border-primary-500": isSelected,
          "border-neutral-500 hover:border-neutral-800": !isSelected
        })}
      >
        <div className="flex items-center gap-2">
          <Icon name={IconNames.MAP_THUMBNAIL} className="h-11 w-11 rounded-lg bg-neutral-300" />
          <div className="flex flex-1 flex-col">
            <Text variant="text-14-bold" className="">
              {title}
            </Text>
            <Text variant="text-14-light">{subtitle}</Text>
          </div>
          <div className="flex" onClick={toggleMenu}>
            <Icon
              name={IconNames.IC_MORE_OUTLINED}
              className="h-4 w-4 rounded-lg hover:fill-primary hover:text-primary lg:h-5 lg:w-5"
            />
          </div>
        </div>
      </div>
      {menuVisible && (
        <div
          className="fixed  z-10 flex flex-col gap-1 overflow-auto rounded-lg bg-white p-2 shadow-[0_0_5px_0_rgba(0,0,0,0.2)]"
          style={{ left: menuPosition.left + 30, top: menuPosition.top }}
        >
          {itemsPrimaryMenu.map(item => (
            <MenuItem
              MenuItemVariant={MENU_ITEM_VARIANT_BLUE}
              key={item.id}
              render={item.render}
              onClick={item.onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MapSidePanelItem;
