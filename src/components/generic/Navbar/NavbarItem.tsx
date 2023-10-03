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
      className={classNames("font-regular uppercase xl:w-full", !props.disabled && "hover:underline", props.className)}
    >
      <Link
        href={props.disabled ? "#" : props.href}
        locale={props.href.includes("/v1/") ? "en-US" : undefined}
        onClick={handleClose}
      >
        <div className={classNames("flex items-center", props.disabled && "cursor-default")}>
          <When condition={props.iconName}>
            <Icon name={props.iconName!} width={16} className="mr-2 hidden fill-neutral-700 lg:block" />
          </When>
          <Text
            as="span"
            variant={props.active ? "text-heading-500" : "text-heading-400"}
            className={classNames(
              "whitespace-nowrap text-neutral-900",
              props.active ? "lg:text-body-500" : "lg:text-body-300",
              props.disabled && "cursor-default"
            )}
          >
            {props.children}
          </Text>
        </div>
      </Link>
    </div>
  );
};

export default NavbarItem;
