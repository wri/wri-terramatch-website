import { Tab as HTab } from "@headlessui/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { DetailedHTMLProps, Fragment, HTMLAttributes, ReactElement, useEffect } from "react";

import Text from "@/components/elements/Text/Text";
import List from "@/components/extensive/List/List";
import { Framework, useFrameworkContext } from "@/context/framework.provider";

import { SecundaryTabsVariants, VARIANT_TABS_PRIMARY } from "./SecuandaryTabsVariants";

export interface SecondaryTabsProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  tabItems: TabItem[];
  containerClassName?: string;
  setSelectedIndex?: (index: number) => void;
  variant?: SecundaryTabsVariants;
  selectedIndex?: number;
}

export interface TabItem {
  title: string;
  body: ReactElement;
  disabled?: boolean;
  key?: string;

  // The tab will only be shown if one of the given frameworks is active.
  show?: Framework[];
  // The tab will only be shown if one of the given frameworks is not active. `hide` will be ignored
  // `show` is also included
  hide?: Framework[];
}

const SecondaryTabs = ({
  tabItems: _tabItems,
  className,
  containerClassName,
  setSelectedIndex,
  selectedIndex,
  variant = VARIANT_TABS_PRIMARY,
  ...divProps
}: SecondaryTabsProps) => {
  const router = useRouter();
  const { framework } = useFrameworkContext();
  const tabItems = _tabItems.filter(item => {
    if (item.show != null) {
      return item.show.includes(framework);
    } else if (item.hide != null) {
      return !item.hide.includes(framework);
    }

    return true;
  });
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
    setSelectedIndex && setSelectedIndex(index);
  };

  useEffect(() => {
    if (selectedIndex !== undefined) {
      onTabChange(selectedIndex);
    }
  }, [selectedIndex]);

  return (
    <HTab.Group selectedIndex={_defaultIndex} onChange={onTabChange}>
      <HTab.List {...divProps} className={classNames(className, "h-max w-full", variant.classNameContentList)}>
        <List
          as="div"
          className={classNames(
            containerClassName,
            tabItems.length <= 5 ? "justify-between lg:justify-start lg:gap-30" : "justify-between",
            "flex h-full items-center",
            variant.listClassName
          )}
          itemAs={Fragment}
          items={tabItems}
          render={item => (
            <HTab as={Fragment}>
              {({ selected }) => (
                <button
                  className={classNames("mb-[-2px] h-full outline-none", variant.itemTabClassName, {
                    [variant.selectedTabClassName || "border-primary"]: selected,
                    "border-transparent": !selected
                  })}
                  disabled={item.disabled}
                >
                  <Text
                    variant={selected ? variant.textVariantSelected : variant.textVariantNotSelected}
                    className={classNames("whitespace-nowrap")}
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
