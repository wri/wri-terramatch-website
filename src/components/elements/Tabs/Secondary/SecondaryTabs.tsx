import { Tab as HTab } from "@headlessui/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { DetailedHTMLProps, Fragment, HTMLAttributes, ReactElement, useEffect, useRef, useState } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { Framework, useFrameworkContext } from "@/context/framework.provider";

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
  const [scrollLeft, setScrollLeft] = useState(0);
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

  const handleScrollNext = () => {
    if (ContentListRef.current) {
      ContentListRef.current.scrollLeft = ContentListRef.current.scrollLeft + 75;
      setScrollLeft(ContentListRef.current.scrollLeft);
    }
  };

  const handleScrollPrev = () => {
    if (ContentListRef.current) {
      ContentListRef.current.scrollLeft = ContentListRef.current.scrollLeft - 75;
      setScrollLeft(ContentListRef.current.scrollLeft);
    }
  };

  useEffect(() => {
    if (ContentListRef.current) {
      console.log("ContentListRef.current", ContentListRef.current.scrollLeft);
      setScrollLeft(ContentListRef.current.scrollLeft);
    }
  }, [ContentListRef.current]);

  console.log("scrollLeft", scrollLeft, ContentListRef.current?.scrollIntoView);

  return (
    <div className="relative">
      <HTab.Group selectedIndex={_defaultIndex} onChange={onTabChange}>
        {scrollable && scrollLeft > 0 && (
          <div
            className="absolute top-0 left-0 z-10 pt-0 pr-4 backdrop-blur"
            style={{ height: `${ContentListRef.current?.clientHeight ?? 0}px` }}
          >
            <Button
              variant="secondary-blue"
              className="sticky z-[2] h-full min-w-[2.5rem] rounded-none border-0 border-r border-neutral-200 p-3"
              onClick={handleScrollPrev}
            >
              <Icon name={IconNames.IC_ARROW_COLLAPSE} className="min-w-3.5 h-3.5 w-3.5 -rotate-90" />
            </Button>
          </div>
        )}
        <HTab.List
          {...divProps}
          className={classNames(className, "h-max w-full", variant.classNameContentList, {
            "scroll-indicator-hide relative": scrollable
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
        {scrollable &&
          scrollLeft < (ContentListRef.current?.scrollWidth ?? 0) - (ContentListRef.current?.clientWidth ?? 0) && (
            <div
              className="absolute top-0 right-0 z-10 flex gap-2 pt-0 pl-4 backdrop-blur"
              style={{ height: `${ContentListRef.current?.clientHeight ?? 0}px` }}
            >
              <Button
                variant="secondary-blue"
                className="sticky z-[2] h-full min-w-[2.5rem] rounded-none border-0 border-l border-neutral-200 p-3"
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
