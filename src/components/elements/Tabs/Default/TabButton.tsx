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
}

export const TabButton = ({ index, item, selected, className, textVariant, ...buttonProps }: TabButtonProps) => {
  return (
    <button
      {...buttonProps}
      className={classNames(
        className,
        `w-full items-center border-t-0 border-r-0 focus:outline-none disabled:text-neutral-800`,
        selected
          ? "bg-white text-neutral-1000"
          : item.done
          ? `${
              index !== 0 && "border-l"
            } border-b border-secondary-500 border-opacity-25 bg-secondary-300 text-neutral-800`
          : `${index !== 0 && "border-l"} border-b border-neutral-500 border-opacity-25 bg-neutral-300 text-neutral-800`
      )}
    >
      <Text variant={textVariant} className="w-full pr-6 text-left line-clamp-2" containHtml>
        {item.title}
      </Text>
      <When condition={item.done}>
        <Icon className="fill-primary-500" name={IconNames.TICK_RECT} width={20} />
      </When>
    </button>
  );
};
