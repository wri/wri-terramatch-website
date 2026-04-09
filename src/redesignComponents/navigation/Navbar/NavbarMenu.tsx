import { Button, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { twMerge } from "tailwind-merge";

import Menu from "@/redesignComponents/actions/Buttons/Menu/Menu";
import { MenuItemProps } from "@/redesignComponents/actions/Buttons/Menu/Menu";

interface NavbarMenuButtonBaseProps {
  prefix?: React.ReactNode;
  label: string;
  suffix?: React.ReactNode;
  disabled?: boolean;
}

type NavbarMenuButtonProps = NavbarMenuButtonBaseProps & {
  className?: string;
  [key: string]: any;
};

interface NavbarMenuProps extends NavbarMenuButtonBaseProps {
  items: MenuItemProps[];
}

const NavbarMenuButton: FC<NavbarMenuButtonProps> = ({
  prefix,
  label,
  suffix,
  disabled,
  className,
  ...triggerProps
}) => {
  return (
    <Button
      disabled={disabled}
      {...triggerProps}
      className={twMerge(
        "group !h-fit w-fit items-center !gap-2 !rounded-none !px-4 !py-3 !text-theme-neutral-100",
        "hover:!bg-theme-primary-700",
        "active:!bg-theme-primary-800",
        "data-[state=open]:!bg-theme-primary-800",
        "focus-within:ring-2 focus-within:ring-theme-primary-700 focus-within:ring-offset-2",
        "focus:outline-none",
        "disabled:!text-neutral-200",
        disabled && "cursor-default",
        className
      )}
    >
      {prefix}
      <Text textStyle="400">{label}</Text>
      {suffix}
    </Button>
  );
};

const NavbarMenu: FC<NavbarMenuProps> = ({ items, prefix, label, suffix }) => {
  return (
    <Menu
      label={label}
      items={items}
      customTrigger={<NavbarMenuButton prefix={prefix} label={label} suffix={suffix} />}
    />
  );
};

export default NavbarMenu;
