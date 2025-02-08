import { Tab as HTab } from "@headlessui/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { DetailedHTMLProps, Fragment, HTMLAttributes, ReactElement, useRef } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { Framework, useFrameworkContext } from "@/context/framework.provider";
import { useValueChanged } from "@/hooks/useValueChanged";

import Button from "../../Button/Button";
import { SecundaryTabsVariants, VARIANT_TABS_PRIMARY } from "./SecuandaryTabsVariants";

export interface SecondaryTabsProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  tabItems: TabItem[];
  containerClassName?: string;
  setSelectedIndex?: (index: number) => void;
  variant?: SecundaryTabsVariants;
  selectedIndex?: number;
  scrollable?: boolean;
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
  scrollable = false,
  variant = VARIANT_TABS_PRIMARY,
  ...divProps
}: SecondaryTabsProps) => {
  const router = useRouter();
  const { framework } = useFrameworkContext();
  const ContentListRef = useRef<HTMLDivElement>(null);
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

  useValueChanged(selectedIndex, () => {
    if (selectedIndex !== undefined) {
      onTabChange(selectedIndex);
    }
  });

  const handleScrollNext = () => {
    if (ContentListRef.current) {
      ContentListRef.current.scrollLeft = ContentListRef.current.scrollLeft + 75;
    }
  };

  const handleScrollPrev = () => {
    if (ContentListRef.current) {
      ContentListRef.current.scrollLeft = ContentListRef.current.scrollLeft - 75;
    }
  };

  return (
    <div className="relative">
      <HTab.Group selectedIndex={_defaultIndex} onChange={onTabChange}>
        <HTab.List
          {...divProps}
          className={classNames(className, "h-max w-full", variant.classNameContentList, {
            "scroll-indicator-hide relative pr-[100px]": scrollable
          })}
          ref={ContentListRef}
        >
          <List
            as="div"
            className={classNames(
              containerClassName,
              tabItems.length <= 5 ? "justify-between lg:justify-start lg:gap-30" : "justify-between",
              "flex h-full items-center",
              variant.listClassName,
              { "scroll-indicator-hide": scrollable }
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
        {scrollable && (
          <div className="absolute top-0 right-0 z-10 flex gap-2 pt-0 pl-3 backdrop-blur">
            <div className="absolute top-0 right-0 z-[1] h-full w-full blur-md" />
            <Button
              variant="secondary-blue"
              className="sticky z-[2] h-10 w-10 min-w-[2.5rem] rounded-full border-none p-0 shadow-monitored"
              onClick={handleScrollPrev}
            >
              <Icon name={IconNames.IC_ARROW_COLLAPSE} className="min-w-3.5 h-3.5 w-3.5 -rotate-90" />
            </Button>
            <Button
              variant="secondary-blue"
              className="sticky z-[2] h-10 w-10 min-w-[2.5rem] rounded-full border-none p-0 shadow-monitored"
              onClick={handleScrollNext}
            >
              <Icon name={IconNames.IC_ARROW_COLLAPSE} className="min-w-3.5 h-3.5 w-3.5 rotate-90" />
            </Button>
          </div>
        )}
        <List as={HTab.Panels} itemAs={HTab.Panel} items={tabItems} render={item => item.body} />
      </HTab.Group>
    </div>
  );
};

export default SecondaryTabs;
