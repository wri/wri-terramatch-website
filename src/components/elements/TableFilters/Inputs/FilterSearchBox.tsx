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
      <Icon name={IconNames.SEARCH} width={20} className="absolute top-[11px] left-4" />
      <input
        type="search"
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="placeholder:text-body-300 text-body-300 w-full rounded-lg border border-neutral-200 py-2 pl-10 pr-4 text-neutral-1000 placeholder:text-neutral-1000"
      />
    </div>
  );
};

export default FilterSearchBox;
