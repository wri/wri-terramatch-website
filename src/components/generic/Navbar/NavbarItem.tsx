/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from "classnames";
import Link from "next/link";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

interface NavbarItemProps {
  href: string;
  active?: boolean;
  className?: string;
  iconName?: IconNames;
  onClick?: () => void;
  children?: string | number;
  disabled?: boolean;
}
const NavbarItem = (props: NavbarItemProps) => {
  const handleClose = () => {
    if (!props.disabled) {
      props.onClick?.();
    }
  };
  return (
    <div
      className={classNames("font-regular uppercase xl:w-full", !props.disabled && "hover:opacity-50", props.className)}
    >
      <Link href={props.disabled ? "#" : props.href} onClick={handleClose}>
        <div className={classNames("flex items-center", props.disabled && "cursor-default")}>
          <When condition={props.iconName}>
            <Icon name={props.iconName!} width={16} className="mr-2 hidden fill-neutral-700 sm:block" />
          </When>
          <Text
            as="span"
            variant={props.active ? "text-14-bold" : "text-14-light"}
            className={classNames("whitespace-nowrap text-white", props.disabled && "cursor-default")}
          >
            {props.children}
          </Text>
        </div>
      </Link>
    </div>
  );
};

export default NavbarItem;
