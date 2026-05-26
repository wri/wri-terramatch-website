import classNames from "classnames";
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef, ReactElement } from "react";

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

    let icon: ReactElement<any> | undefined = undefined;
    if (selected) icon = <Icon className="text-success " name={IconNames.EDIT_TA} width={20} />;
    else {
      switch (item.state) {
        case "complete":
          icon = <Icon className="text-success-410 " name={IconNames.APPROVED_COLORLESS} width={20} />;
          break;

        case "error":
          icon = <Icon name={IconNames.STATUS_REJECTED} width={20} />;
          break;
      }
    }

    return (
      <button
        {...buttonProps}
        role="option"
        aria-selected={selected ? "true" : "false"}
        aria-checked={item.state === "complete" ? "true" : "false"}
        className={classNames(
          className,
          "w-full items-center focus:outline-none disabled:text-neutral-900",
          item.state != null && "peer",
          lastItem || selected ? "border-b" : "border-b",
          selected
            ? "border-success text-blueCustom-900  peer-aria-checked:shadow-t-secondary border bg-white"
            : item.state === "complete"
            ? `bg-primary border-white text-white `
            : `bg-grey-950 text-blueCustom-900 border-b border-white`
        )}
      >
        <Text variant={textVariant} className="line-clamp-2 w-full text-left md:pr-6" containHtml>
          {item.title}
        </Text>
        {icon}
      </button>
    );
  }
);
