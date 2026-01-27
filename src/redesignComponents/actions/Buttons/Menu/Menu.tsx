import { Menu as WriMenu } from "@worldresources/wri-design-systems";
import { FC } from "react";

export interface MenuItemProps {
  label?: string;
  caption?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  command?: string;
  children?: React.ReactNode;
  value?: string;
  disabled?: boolean;
  submenu?: MenuItemProps[];
  onClick?: () => void;
  link?: string;
}

interface IMenuProps {
  label: string;
  items?: MenuItemProps[];
  groups?: {
    title: string;
    items: MenuItemProps[];
  }[];
  onSelect?: (value: string) => void;
  customTrigger?: React.ReactNode;
}

const Menu: FC<IMenuProps> = ({ label, items, groups, onSelect, customTrigger, ...props }) => {
  return (
    <WriMenu label={label} items={items} groups={groups} onSelect={onSelect} customTrigger={customTrigger} {...props} />
  );
};

export default Menu;
