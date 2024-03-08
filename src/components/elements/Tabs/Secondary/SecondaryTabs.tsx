import { Tab as HTab } from "@headlessui/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { DetailedHTMLProps, Fragment, HTMLAttributes, ReactElement } from "react";

import Text from "@/components/elements/Text/Text";
import List from "@/components/extensive/List/List";

export interface SecondaryTabsProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  tabItems: TabItem[];
  containerClassName?: string;
}

export interface TabItem {
  title: string;
  body: ReactElement;
  disabled?: boolean;
  key?: string;
  hidden?: boolean;
}

const SecondaryTabs = ({ tabItems: _tabItems, className, containerClassName, ...divProps }: SecondaryTabsProps) => {
  const router = useRouter();
  const tabItems = _tabItems.filter(item => !item.hidden);
  //Default to zero
  const _defaultIndex = Math.max(
    tabItems.findIndex(item => item.key === router.query.tab),
    0
  );

  const onTabChange = (index: number) => {
    const key = tabItems[index].key;

    if (key) {
      router.query.tab = key;
      router.push(router, undefined, { shallow: true });
    }
  };

  return (
    <HTab.Group selectedIndex={_defaultIndex} onChange={onTabChange}>
      <HTab.List {...divProps} className={classNames(className, "h-12 w-full border-b border-neutral-400 bg-white")}>
        <List
          as="div"
          className={classNames(
            containerClassName,
            tabItems.length <= 5 ? "justify-between lg:justify-start lg:gap-30" : "justify-between",
            "m-auto flex h-full items-center"
          )}
          itemAs={Fragment}
          items={tabItems}
          render={item => (
            <HTab as={Fragment}>
              {({ selected }) => (
                <button
                  className={classNames("h-full border-b-[3px] px-4 pt-[3px] outline-none", {
                    "border-primary": selected,
                    "border-transparent": !selected
                  })}
                  disabled={item.disabled}
                >
                  <Text
                    variant={selected ? "text-16-bold" : "text-16-light"}
                    className={classNames("whitespace-nowrap", "text-black")}
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
