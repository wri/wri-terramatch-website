import { Tab as HTab } from "@headlessui/react";
import classNames from "classnames";
import { Fragment, ReactElement, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import { CarouselBreakPoints } from "@/components/extensive/Carousel/Carousel";
import List from "@/components/extensive/List/List";
import { TextVariants } from "@/types/common";

import { TabButton } from "./TabButton";

export interface TabsProps {
  tabItems: TabItem[];
  carouselOptions?: {
    slidesPerView?: number;
    breakpoints?: CarouselBreakPoints;
  };
  itemOption: {
    width?: number;
    textVariant?: TextVariants;
  };

  className?: string;
  tabListClassName?: string;
  rounded?: boolean;

  selectedIndex?: number;
  selectedTabKey?: string;
  onChangeSelected?: (selected: number) => void;

  sticky?: boolean;
}

export interface TabItem {
  title: string;
  body: ReactElement;
  done?: boolean;
  disabled?: boolean;
  key?: string;
}

const Tabs = (props: TabsProps) => {
  const initialSelectedIndex = props.selectedTabKey
    ? props.tabItems.findIndex(item => item.key === props.selectedTabKey)
    : props.selectedIndex || 0;

  const [selectedIndex, setSelectedIndex] = useState<number>(initialSelectedIndex);

  useEffect(() => {
    typeof props.selectedIndex === "number" && setSelectedIndex(props.selectedIndex);
  }, [props.selectedIndex]);

  return (
    <HTab.Group
      as="div"
      vertical
      className={twMerge("flex h-full w-full shadow", props.className)}
      selectedIndex={selectedIndex}
      //@ts-ignore
      onChange={v => {
        setSelectedIndex(v);
        props.onChangeSelected?.(v);
      }}
    >
      <HTab.List
        className={twMerge("flex w-full max-w-[86px] flex-grow flex-col md:max-w-[280px]", props.tabListClassName)}
      >
        <List
          as={Fragment}
          itemAs={Fragment}
          items={props.tabItems}
          render={(item, index, array) => (
            <HTab as={Fragment}>
              {({ selected }) => (
                <TabButton
                  index={index}
                  className={classNames(
                    "flex min-h-[70px] w-full items-center justify-start py-4 px-6",
                    props.rounded && "first:rounded-tl-lg"
                  )}
                  item={item}
                  selected={selected}
                  lastItem={array.length - 1 === index}
                  textVariant="text-bold-caption-200"
                  disabled={item.disabled}
                />
              )}
            </HTab>
          )}
        />
        <div className={classNames("flex-1 border border-neutral-100 bg-white", props.rounded && "rounded-bl-lg ")} />
      </HTab.List>
      <HTab.Panels
        className={classNames(
          "w-full overflow-hidden border border-l-0 border-neutral-100",
          props.rounded && "rounded-r-lg"
        )}
      >
        {props.tabItems?.[selectedIndex]?.body}
      </HTab.Panels>
    </HTab.Group>
  );
};

export default Tabs;
