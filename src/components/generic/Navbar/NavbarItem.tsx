/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from "classnames";
import Link from "next/link";
import { FC, useCallback } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

type NavbarItemProps = {
  href: string;
  active?: boolean;
  className?: string;
  iconName?: IconNames;
  onClick?: () => void;
  children?: string | number;
  disabled?: boolean;
};

const NavbarItem: FC<NavbarItemProps> = props => {
  const { disabled, onClick } = props;
  const handleClose = useCallback(() => {
    if (!disabled) {
      onClick?.();
    }
  }, [disabled, onClick]);

  return (
    <div
      className={classNames("font-regular uppercase xl:w-full", !props.disabled && "hover:opacity-50", props.className)}
    >
      <Link href={props.disabled ? "#" : props.href} onClick={handleClose}>
        <div className={classNames("flex items-center", props.disabled && "cursor-default")}>
          {props.iconName != null && (
            <Icon name={props.iconName} width={16} className="mr-2 hidden fill-neutral-700 sm:block" />
          )}
          <Text
            as="span"
            variant={props.active ? "text-14-bold" : "text-14-light"}
            className={classNames("whitespace-nowrap text-darkCustom", props.disabled && "cursor-default")}
          >
            {props.children}
          </Text>
        </div>
      </Link>
    </div>
  );
};

export default NavbarItem;
