import classNames from "classnames";
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from "react";
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

export const TabButton = forwardRef(
  ({ index, item, lastItem, selected, className, textVariant, ...buttonProps }: TabButtonProps, ref) => {
    // @ts-ignore
    buttonProps["ref"] = ref;
    return (
      <button
        {...buttonProps}
        role="option"
        aria-selected={selected ? "true" : "false"}
        aria-checked={item.done ? "true" : "false"}
        className={classNames(
          className,
          "w-full items-center focus:outline-none disabled:text-neutral-900",
          item.done && "peer",
          lastItem || selected ? "border-b" : "border-b",
          selected
            ? "border border-success  bg-white text-blueCustom-900 peer-aria-checked:shadow-t-secondary"
            : item.done
            ? `border-white bg-primary text-white `
            : `border-b border-white bg-grey-950 text-blueCustom-900`
        )}
      >
        <Text variant={textVariant} className="line-clamp-2 w-full text-left md:pr-6" containHtml>
          {item.title}
        </Text>
        <When condition={item.done}>
          <Icon className="text-success-410 " name={IconNames.APPROVED_COLORLESS} width={20} />
        </When>
        <When condition={selected}>
          <Icon className="text-success " name={IconNames.EDIT_TA} width={20} />
        </When>
      </button>
    );
  }
);
