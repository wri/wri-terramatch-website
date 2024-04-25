import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import SelectImageLabel from "@/components/elements/Inputs/SelectImage/SelectImageLabel";
import List from "@/components/extensive/List/List";
import { Option } from "@/types/common";
import { appendApiBaseUrl } from "@/utils/image";
import { valuesToOptions } from "@/utils/options";

export interface SelectImageListProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  variant?: "primary" | "secondary";
  options: Option[];
  selectedValues: string[];
  selectable?: boolean;
}

const SelectImageList = ({
  variant = "secondary",
  options,
  selectedValues,
  className,
  selectable = true,
  ...divProps
}: SelectImageListProps) => {
  return (
    <List
      {...divProps}
      as="div"
      className={classNames(className, "grid-cols-3 flex w-fit flex-wrap gap-5")}
      itemAs="div"
      items={valuesToOptions(selectedValues, options)}
      render={item => (
        <SelectImageLabel
          title={item.title}
          imageUrl={appendApiBaseUrl(item.meta.image_url)}
          variant={variant}
          clickable={selectable}
        />
      )}
    />
  );
};

export default SelectImageList;
