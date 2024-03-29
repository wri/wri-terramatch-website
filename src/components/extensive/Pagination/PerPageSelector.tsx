import { Listbox, Transition } from "@headlessui/react";
import classNames from "classnames";
import { PropsWithChildren, useState } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export interface PerPageSelectorProps {
  label?: string;
  value?: number;
  defaultValue?: number;
  options: number[];

  className?: string;
  onChange: (value: number) => void;
}

const PerPageSelector = (props: PropsWithChildren<PerPageSelectorProps>) => {
  const [selected, setSelected] = useState(props.defaultValue);

  const onChangeHandler = (value: any) => {
    setSelected(value);
    props.onChange(value);
  };

  return (
    <Listbox as="div" className={classNames("space-y-2", props.className)} value={selected} onChange={onChangeHandler}>
      {({ open, value }) => (
        <>
          <div className="flex items-center gap-3">
            <Listbox.Button as="div" className="flex h-10 w-20 items-center justify-center rounded-md shadow">
              <div className="flex h-full flex-1 items-center justify-center">
                <Text variant="text-bold-subtitle-500" className="w-fit uppercase line-clamp-1">
                  {value}
                </Text>
              </div>
              <div className="flex h-full flex-1 items-center justify-center rounded-r-lg bg-primary-200">
                <Icon
                  name={IconNames.CHEVRON_DOWN}
                  className={classNames("mb-[2px] fill-neutral-900 transition", open && "rotate-180")}
                  width={20}
                />
              </div>
            </Listbox.Button>

            <Listbox.Label as={Text} variant="text-bold-subtitle-500">
              {props.label}
            </Listbox.Label>
          </div>
          <Transition
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
              className="mt-2 max-h-[400px] overflow-auto rounded-lg border border-neutral-100 shadow"
            >
              {props.options.map(option => {
                let isSelected = value === option;

                return (
                  <Listbox.Option
                    as={Text}
                    key={option}
                    value={option}
                    variant={isSelected ? "text-bold-subtitle-500" : "text-light-subtitle-400"}
                    className={classNames(
                      "cursor-pointer border-b border-neutral-100 bg-white px-4 py-3 last:border-none hover:bg-primary-100"
                    )}
                  >
                    {option}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </Transition>
        </>
      )}
    </Listbox>
  );
};

export default PerPageSelector;
