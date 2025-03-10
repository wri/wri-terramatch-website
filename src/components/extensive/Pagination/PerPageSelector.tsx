import { Listbox, Transition } from "@headlessui/react";
import classNames from "classnames";
import { PropsWithChildren, useState } from "react";
import { twMerge as tw } from "tailwind-merge";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { TextVariants } from "@/types/common";

import { VariantPagination } from "./PaginationVariant";

export interface PerPageSelectorProps {
  label?: string;
  value?: number;
  defaultValue?: number;
  options: number[];
  variantText?: TextVariants;
  invertSelect?: boolean;
  className?: string;
  onChange: (value: number) => void;
  variant?: VariantPagination;
}

const PerPageSelector = (props: PropsWithChildren<PerPageSelectorProps>) => {
  const [selected, setSelected] = useState(props.defaultValue);

  const onChangeHandler = (value: any) => {
    setSelected(value);
    props.onChange(value);
  };

  return (
    <Listbox
      as="div"
      className={classNames("space-y-2 mobile:hidden", props.className)}
      value={selected}
      onChange={onChangeHandler}
    >
      {({ open, value }) => (
        <>
          <div className="flex items-center gap-3">
            <Listbox.Button
              as="div"
              className={classNames(
                "relative flex h-10 w-20 items-center justify-center rounded-md shadow",
                props.variant?.value
              )}
            >
              <Transition
                show={open}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100 !mt-0"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0 !mt-0"
              >
                <Listbox.Options
                  as="div"
                  className={classNames(
                    "absolute z-10 mt-6 max-h-[400px] overflow-auto rounded-lg border border-neutral-100 shadow outline-none",
                    { "bottom-[35px]": props.invertSelect }
                  )}
                >
                  {props.options.map(option => {
                    let isSelected = value === option;

                    return (
                      <Listbox.Option
                        as={Text}
                        key={option}
                        value={option}
                        reversed={props.invertSelect}
                        variant={props.variantText ?? "text-14"}
                        className={tw(
                          "cursor-pointer border-b border-neutral-100 bg-white px-4 py-3 last:border-none hover:bg-primary-100",
                          isSelected
                            ? props.variant?.textNumberNoSelected
                              ? props.variant?.textNumberNoSelected
                              : "!font-bold"
                            : props.variant?.textNumberSelected
                            ? props.variant?.textNumberSelected
                            : "!font-light"
                        )}
                      >
                        {option}
                      </Listbox.Option>
                    );
                  })}
                </Listbox.Options>
              </Transition>
              <div className="flex h-full flex-1 items-center justify-center">
                <Text variant={props.variantText ?? "text-bold-subtitle-500"} className="w-fit uppercase line-clamp-1">
                  {value}
                </Text>
              </div>
              <div
                className={classNames(
                  "flex h-full flex-1 items-center justify-center rounded-r-lg bg-[#CFE6F4]",
                  props.variant?.iconContent
                )}
              >
                <Icon
                  name={IconNames.CHEVRON_DOWN}
                  className={classNames(
                    "mb-[2px] fill-neutral-900 transition",
                    open && "rotate-180",
                    props.variant?.icon
                  )}
                  width={20}
                />
              </div>
            </Listbox.Button>

            <Listbox.Label
              as={Text}
              variant={props.variantText ?? "text-bold-subtitle-500"}
              className={classNames(props.variant?.label)}
            >
              {props.label}
            </Listbox.Label>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default PerPageSelector;
