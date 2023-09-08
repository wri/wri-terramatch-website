import classNames from "classnames";
import { Fragment } from "react";

import List from "@/components/extensive/List/List";

import { ExplainerItem, ExplainerItemProps } from "./ExplainerItem";

export interface ExplainerSectionProps {
  items: ExplainerItemProps[];
  className?: string;
}

const ExplainerSection = (props: ExplainerSectionProps) => {
  return (
    <List
      itemAs={Fragment}
      className={classNames("flex flex-col gap-15 md:flex-row md:gap-1", props.className)}
      items={props.items}
      dividerComponent={<div className="mt-16 hidden h-[1px] w-10 bg-neutral-300 md:block" />}
      render={item => <ExplainerItem {...item} />}
    />
  );
};

export default ExplainerSection;
