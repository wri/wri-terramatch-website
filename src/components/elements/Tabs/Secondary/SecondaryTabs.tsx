import { Tab as HTab } from "@headlessui/react";
import classNames from "classnames";
import { DetailedHTMLProps, Fragment, HTMLAttributes, ReactElement } from "react";

import Text from "@/components/elements/Text/Text";
import List from "@/components/extensive/List/List";

export interface SecondaryTabsProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  tabItems: TabItem[];
  defaultIndex?: number;
  defaultTabKey?: string;
  containerClassName?: string;
}

export interface TabItem {
  title: string;
  body: ReactElement;
  disabled?: boolean;
  key?: string;
}

const SecondaryTabs = ({
  tabItems,
  className,
  containerClassName,
  defaultIndex,
  defaultTabKey,
  ...divProps
}: SecondaryTabsProps) => {
  const _defaultIndex = defaultTabKey ? tabItems.findIndex(item => item.key === defaultTabKey) : defaultIndex || 0;

  return (
    <HTab.Group defaultIndex={_defaultIndex}>
      <HTab.List {...divProps} className={classNames(className, "h-12 w-full border-b border-neutral-400 bg-white")}>
        <List
          as="div"
          className={classNames(containerClassName, "m-auto flex h-full items-center justify-between")}
          itemAs={Fragment}
          items={tabItems}
          render={item => (
            <HTab as={Fragment}>
              {({ selected }) => (
                <button
                  className={classNames("h-full px-4 outline-none", {
                    "border-b-[3px] border-primary": selected
                  })}
                  disabled={item.disabled}
                >
                  <Text
                    variant="text-heading-200"
                    className={classNames("whitespace-nowrap", selected ? "text-black" : "text-neutral-700")}
                  >
                    {item.title}
                  </Text>
                </button>
              )}
            </HTab>
          )}
        />
      </HTab.List>
      <List as={HTab.Panels} itemAs={HTab.Panel} items={tabItems} render={item => item.body} />
    </HTab.Group>
  );
};

export default SecondaryTabs;
