import { Tab as HTab } from "@headlessui/react";
import classNames from "classnames";
import { Fragment, ReactElement, useEffect, useMemo, useState } from "react";
import { Else, If, Then, When } from "react-if";
import { SwiperRef } from "swiper/react";

import Carousel, { CarouselBreakPoints } from "@/components/extensive/Carousel/Carousel";
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
  vertical?: boolean;
  className?: string;

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
  const [swiper, setSwiper] = useState<SwiperRef["swiper"] | null>(null);
  const initialSelectedIndex = props.selectedTabKey
    ? props.tabItems.findIndex(item => item.key === props.selectedTabKey)
    : props.selectedIndex || 0;

  const [selectedIndex, setSelectedIndex] = useState<number>(initialSelectedIndex);

  useEffect(() => {
    typeof props.selectedIndex === "number" && setSelectedIndex(props.selectedIndex);
  }, [props.selectedIndex]);

  const carouselBreakPoints = useMemo(() => {
    const output: CarouselBreakPoints = {};
    if (!props.itemOption.width) return undefined;

    props.tabItems.forEach((_, index) => {
      output[index * props.itemOption.width!] = { slidesPerView: index + 1 };
    });

    return output;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.itemOption.width, props.tabItems.length]);

  useEffect(() => {
    if (swiper) {
      swiper.slideTo(selectedIndex, 0);
    }
  }, [selectedIndex, swiper]);

  return (
    <HTab.Group
      as="div"
      vertical={props.vertical}
      className={classNames("flex h-full w-full", !props.vertical && "flex-col", props.className)}
      selectedIndex={selectedIndex}
      //@ts-ignore
      onChange={v => {
        setSelectedIndex(v);
        props.onChangeSelected?.(v);
      }}
    >
      <If condition={props.vertical}>
        <Then>
          <HTab.List className="flex w-full max-w-[390px] flex-grow flex-col gap-[0.125rem] border-r-2 border-neutral-200">
            <List
              as={Fragment}
              itemAs={Fragment}
              items={props.tabItems}
              render={(item, index) => (
                <HTab as={Fragment}>
                  {({ selected }) => (
                    <TabButton
                      index={index}
                      className={classNames("flex min-h-[62px] w-full items-center justify-start py-[14px] pl-8")}
                      item={item}
                      selected={selected}
                      textVariant={props.itemOption.textVariant || "text-heading-300"}
                      disabled={item.disabled}
                    />
                  )}
                </HTab>
              )}
            />
          </HTab.List>
        </Then>
        <Else>
          <HTab.List
            className={classNames(
              props.sticky && "sticky top-[243px] z-10",
              "overflow-hidden rounded-t-lg border-l border-t border-r border-neutral-100"
            )}
          >
            <Carousel
              slidesPerView={props.carouselOptions?.slidesPerView}
              breakpoints={props.carouselOptions?.breakpoints || carouselBreakPoints}
              items={props.tabItems}
              spaceBetween={0}
              hidePaginationBullet
              className="bg-neutral-50"
              onSwiper={setSwiper}
              carouselItem={(item, index) => (
                <HTab as={Fragment}>
                  {({ selected }) => (
                    <TabButton
                      index={index}
                      className={classNames("flex h-[68px] items-start justify-start px-6 py-[14px]")}
                      item={item}
                      selected={selected}
                      textVariant={props.itemOption.textVariant || "text-heading-300"}
                      disabled={item.disabled}
                    />
                  )}
                </HTab>
              )}
            />
          </HTab.List>
          <When condition={props.sticky}>
            <div className="fixed h-[20px] w-full bg-primary-50">
              {/* Hack to hide the top rounded border, overflow hidden will break sticky! */}
            </div>
          </When>
        </Else>
      </If>
      <HTab.Panels className="w-full overflow-hidden rounded-b-lg border-l border-b border-r border-neutral-100">
        {props.tabItems?.[selectedIndex]?.body}
      </HTab.Panels>
    </HTab.Group>
  );
};

export default Tabs;
