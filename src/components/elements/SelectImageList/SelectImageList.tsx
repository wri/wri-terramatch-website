import classNames from "classnames";
import { DetailedHTMLProps, Fragment, HTMLAttributes } from "react";

import SelectImageLabel from "@/components/elements/Inputs/SelectImage/SelectImageLabel";
import List from "@/components/extensive/List/List";
import { Option } from "@/types/common";
import { valuesToOptions } from "@/utils/options";

export interface SelectImageListProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  options: Option[];
  selectedValues: string[];
}

const SelectImageList = ({ options, selectedValues, className, ...divProps }: SelectImageListProps) => {
  return (
    <div {...divProps} className={classNames(className, "grid w-fit grid-cols-3 gap-x-4 gap-y-9")}>
      <List
        as={Fragment}
        itemAs="div"
        items={valuesToOptions(selectedValues, options)}
        render={item => <SelectImageLabel title={item.title} imageUrl={item.meta.image_url} />}
      />
    </div>
  );
};

export default SelectImageList;
