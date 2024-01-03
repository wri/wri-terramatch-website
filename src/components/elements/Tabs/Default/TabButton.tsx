import classNames from "classnames";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { TextVariants } from "@/types/common";

import { TabItem } from "./Tabs";

export interface TabButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  index: number;
  item: TabItem;
  selected?: boolean;
  textVariant: TextVariants;
  lastItem?: boolean;
}

export const TabButton = ({
  index,
  item,
  lastItem,
  selected,
  className,
  textVariant,
  ...buttonProps
}: TabButtonProps) => {
  return (
    <button
      {...buttonProps}
      role="option"
      aria-selected={selected ? "true" : "false"}
      aria-checked={item.done ? "true" : "false"}
      className={classNames(
        className,
        `w-full items-center focus:outline-none disabled:text-neutral-900`,
        "",
        item.done && "peer",
        lastItem || selected ? "" : "border-b-0",
        selected
          ? `border-l-4 border-l-[#27A9E0]
          bg-white text-neutral-1000 peer-aria-checked:shadow-t-secondary`
          : item.done
          ? `border-secondary-500 bg-secondary-300 text-neutral-800  `
          : `bg-[rgba(0, 0, 0, 0.03)] border-l-4 border-b-2 border-l-transparent border-b-white text-neutral-900`
      )}
    >
      <Text variant={textVariant} className="w-full text-left line-clamp-2 md:pr-6" containHtml>
        {item.title}
      </Text>
      <When condition={item.done}>
        <Icon className="fill-primary-500" name={IconNames.TICK_RECT} width={20} />
      </When>
    </button>
  );
};
