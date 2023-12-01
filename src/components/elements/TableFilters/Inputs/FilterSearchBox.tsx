import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export interface FilterSearchBoxProps
  extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "label" | "onChange"> {
  label?: string;
  placeholder?: string;
  value?: string;

  onChange: (value: string) => void;
}

const FilterSearchBox = ({
  label,
  placeholder,
  value,
  onChange,
  className,
  ...props
}: PropsWithChildren<FilterSearchBoxProps>) => {
  return (
    <div {...props} className={classNames(className, "relative")}>
      <Icon name={IconNames.SEARCH} width={20} className="absolute top-[6.25px] left-1.5 fill-neutral-900" />
      <input
        type="search"
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="placeholder:text-light-subtitle-400 text-light-subtitle-400 h-8 w-full rounded-lg border border-neutral-100 pl-8 text-neutral-1000 placeholder:text-neutral-1000"
      />
    </div>
  );
};

export default FilterSearchBox;
