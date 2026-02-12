import classNames from "classnames";
import { ReactElement, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

import { CarouselBreakPoints } from "@/components/extensive/Carousel/Carousel";
import { useValueChanged } from "@/hooks/useValueChanged";
import FormNavigation from "@/redesignComponents/navigation/FormNavigation/FormNavigation";
import type { TabType } from "@/redesignComponents/navigation/FormNavigation/formNavigation.constants";
import { TextVariants } from "@/types/common";

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
  renderBody: () => ReactElement;
  state?: "unstarted" | "complete" | "error";
  disabled?: boolean;
  key?: string;
}

const Tabs = (props: TabsProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(() =>
    props.selectedTabKey != null
      ? props.tabItems.findIndex(item => item.key === props.selectedTabKey)
      : props.selectedIndex ?? 0
  );

  useValueChanged(props.selectedIndex, () => {
    if (typeof props.selectedIndex === "number") setSelectedIndex(props.selectedIndex);
  });

  const mapStateToType = (state?: TabItem["state"]): TabType => {
    switch (state) {
      case "complete":
        return "complete";
      case "error":
        return "error";
      case "unstarted":
      default:
        return "available";
    }
  };

  const formNavigationTabs = useMemo(
    () =>
      props.tabItems.map((item, index) => ({
        label: item.title,
        value: item.key ?? `tab-${index}`,
        type: mapStateToType(item.state),
        disabled: item.disabled
      })),
    [props.tabItems]
  );

  const handleTabClick = (value: string) => {
    const index = props.tabItems.findIndex((item, idx) => (item.key ?? `tab-${idx}`) === value);
    if (index >= 0) {
      setSelectedIndex(index);
      props.onChangeSelected?.(index);
    }
  };

  const currentTabValue = props.tabItems[selectedIndex]?.key ?? `tab-${selectedIndex}`;

  return (
    <div className={twMerge("flex h-full w-full rounded-2xl bg-theme-neutral-100 shadow", props.className)}>
      <div className={twMerge("flex flex-col", props.tabListClassName)}>
        <FormNavigation tabs={formNavigationTabs} defaultValue={currentTabValue} onTabClick={handleTabClick} />
      </div>
      <div
        className={classNames(
          "w-full overflow-hidden border border-l-0 border-neutral-100",
          props.rounded && "rounded-r-lg"
        )}
      >
        {props.tabItems?.[selectedIndex]?.renderBody()}
      </div>
    </div>
  );
};

export default Tabs;
