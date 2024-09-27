import { Listbox, Transition } from "@headlessui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { PropsWithChildren, useState } from "react";
import { When } from "react-if";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { Option } from "@/types/common";
import { toArray } from "@/utils/array";
import { formatOptionsList } from "@/utils/options";

import Text from "../../Text/Text";

export interface FilterDropDownProps {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  options: Option[];

  className?: string;
  onChange: (value: string) => void;
  classNameContent?: string;
}

const FilterDropDown = (props: PropsWithChildren<FilterDropDownProps>) => {
  const [selected, setSelected] = useState(props.defaultValue);
  const t = useT();

  const onChangeHandler = (value: any) => {
    setSelected(value);
    props.onChange(value);
  };

  return (
    <Listbox as="div" className={classNames("space-y-2", props.className)} value={selected} onChange={onChangeHandler}>
      {({ open, value }) => (
        <div className="flex items-center gap-3">
          <When condition={!!props.label}>
            <Listbox.Label as={Text} variant="text-16-bold">
              {t(props.label)}
            </Listbox.Label>
          </When>
          <div className="relative">
            <Listbox.Button
              as="div"
              className={classNames(
                "pitems-center flex items-center justify-center gap-1 rounded-md border border-neutral-200 bg-white py-2 pl-4 pr-4",
                props.classNameContent
              )}
            >
              <Text variant="text-14-bold" className="line-clamp-1 w-full uppercase">
                {formatOptionsList(props.options, toArray<any>(value)) || props.placeholder}
              </Text>
              <Icon
                name={IconNames.CHEVRON_DOWN}
                className={classNames(" right-4 top-3 fill-neutral-900 transition", open && "rotate-180")}
                width={20}
              />
            </Listbox.Button>
            <Transition
              className="relative z-50 bg-white"
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Listbox.Options
                as="div"
                className="absolute left-0 right-0 top-0 z-50 mt-2 max-h-[400px] overflow-auto rounded-lg border border-neutral-100 shadow"
              >
                {props.options.map(option => {
                  let isSelected = selected === option.value;

                  return (
                    <Listbox.Option
                      as={Text}
                      key={option.value}
                      value={option.value}
                      variant={isSelected ? "text-bold-caption-200" : "text-light-caption-200"}
                      className={classNames(
                        "cursor-pointer border-b border-neutral-100 bg-white px-4 py-3 last:border-none hover:bg-primary-100"
                      )}
                    >
                      {option.title}
                    </Listbox.Option>
                  );
                })}
              </Listbox.Options>
            </Transition>
          </div>
        </div>
      )}
    </Listbox>
  );
};

export default FilterDropDown;
