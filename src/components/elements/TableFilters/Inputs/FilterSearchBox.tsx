import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { twMerge as tw } from "tailwind-merge";

import Icon from "@/components/extensive/Icon/Icon";

import { FILTER_SEARCH_BOX_DEFAULT, FilterSearchBoxVariant } from "./FilterSearchBoxVariants";

export interface FilterSearchBoxProps
  extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "label" | "onChange"> {
  label?: string;
  placeholder?: string;
  variant?: FilterSearchBoxVariant;
  value?: string;
  suffix?: ReactNode;

  onChange: (value: string) => void;
}

const FilterSearchBox = ({
  label,
  placeholder,
  variant = FILTER_SEARCH_BOX_DEFAULT,
  value,
  onChange,
  className,
  suffix,
  ...props
}: PropsWithChildren<FilterSearchBoxProps>) => {
  return (
    <div {...props} className={tw(variant.container, className)}>
      <Icon name={variant.icon} className={variant.iconClassName} />
      <input
        type="search"
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={variant.input}
        value={value}
      />
      {suffix}
    </div>
  );
};

export default FilterSearchBox;
