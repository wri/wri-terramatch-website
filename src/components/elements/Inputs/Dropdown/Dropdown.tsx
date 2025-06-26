import { Listbox, Transition } from "@headlessui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { isEmpty, uniq } from "lodash";
import React, { ChangeEvent, Fragment, PropsWithChildren, useCallback, useMemo, useRef } from "react";
import { ErrorOption, FieldError } from "react-hook-form";
import { twMerge as tw } from "tailwind-merge";

import ErrorMessage from "@/components/elements/ErrorMessage/ErrorMessage";
import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import Input from "@/components/elements/Inputs/Input/Input";
import InputDescription from "@/components/elements/Inputs/InputElements/InputDescription";
import InputLabel from "@/components/elements/Inputs/InputElements/InputLabel";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useValueChanged } from "@/hooks/useValueChanged";
import { Option, OptionValue, TextVariants } from "@/types/common";
import { toArray } from "@/utils/array";
import { formatOptionsList } from "@/utils/options";

import { DropdownVariant, VARIANT_DROPDOWN_DEFAULT } from "./DropdownVariant";

export interface DropdownProps {
  customName?: string;
  label?: string;
  suffixLabelView?: boolean;
  suffixLabel?: React.ReactNode;
  labelClassName?: string;
  labelVariant?: TextVariants;
  description?: string;
  placeholder?: string;
  value?: OptionValue[];
  options: Option[];
  iconName?: IconNames;
  className?: string;
  inputVariant?: TextVariants;
  optionsClassName?: string;
  optionClassName?: string;
  optionTextClassName?: string;
  optionVariant?: TextVariants;
  containerClassName?: string;
  defaultValue?: OptionValue[];
  required?: boolean;
  error?: FieldError;
  prefix?: React.ReactNode;
  variant?: DropdownVariant;
  multiSelect?: boolean;
  hasOtherOptions?: boolean;
  optionsFilter?: string;
  feedbackRequired?: boolean;
  showClear?: boolean;
  showLabelAsMultiple?: boolean;
  multipleText?: string;
  disableOptionTitles?: string[] | undefined;
  onChange: (value: OptionValue[]) => void;
  onClear?: () => void;
  onInternalError?: (error: ErrorOption) => void;
  showSelectAll?: boolean;
  titleClassname?: string;
  titleContainerClassName?: string;
}

const OTHER_KEY = "other#value#key";

const getAllowedValues = (values: OptionValue[], options: Option[]) =>
  uniq(values.filter(v => options.find(o => o.value === v)).filter(v => !!v));

const getSelected = (values: OptionValue[], options: Option[], otherSelected: boolean) => {
  const selected = getAllowedValues(values, options);
  if (otherSelected) selected.push(OTHER_KEY);
  return selected;
};

const getOtherValue = (values: OptionValue[], options: Option[]) =>
  values.find(v => options.find(({ value }) => v === value) == null) ?? "";

const formatSelectedValues = (
  selected: OptionValue[],
  options: Option[],
  value: any,
  showLabelAsMultiple?: boolean,
  placeholder?: string,
  multipleText?: string
) => {
  if (selected.length > 1 && showLabelAsMultiple) {
    if (multipleText) {
      return multipleText;
    }
    const basePlaceholder = placeholder?.endsWith("s") ? placeholder.slice(0, -1) : placeholder;
    return `Multiple ${basePlaceholder}s`;
  } else {
    return formatOptionsList(options, toArray<any>(value));
  }
};

const useSelected = (
  { value, defaultValue, options }: Pick<DropdownProps, "value" | "defaultValue" | "options">,
  otherSelected: boolean
) => {
  // Use a string for the value so that selected is only recalculated if the content of the props value changes
  const serializedValue = useMemo(() => JSON.stringify(value ?? defaultValue ?? []), [defaultValue, value]);
  return useMemo(() => {
    const deserializedValue = JSON.parse(serializedValue);
    return {
      selected: getSelected(deserializedValue, options, otherSelected),
      otherValue: otherSelected ? getOtherValue(deserializedValue, options) : ""
    };
  }, [options, otherSelected, serializedValue]);
};

const Dropdown = (props: PropsWithChildren<DropdownProps>) => {
  const t = useT();
  const { variant = VARIANT_DROPDOWN_DEFAULT, showClear, showSelectAll, onClear } = props;

  // Use a ref so setting it doesn't trigger a re-render, and the value is immediately changed when
  // modified in onChange()
  const otherSelected = useRef(
    (props.hasOtherOptions ?? false) && !isEmpty(getOtherValue(props.value ?? [], props.options))
  );
  const { selected, otherValue } = useSelected(props, otherSelected.current);

  const onChange = useCallback(
    (value: OptionValue | OptionValue[], _otherValue?: string) => {
      if (value == null) {
        otherSelected.current = false;
        props.onChange([]);
      } else {
        value = toArray(value);
        otherSelected.current = value.includes(OTHER_KEY);
        const values = getAllowedValues(value, props.options);
        if (otherSelected.current) values.push(_otherValue ?? otherValue);
        props.onChange(values);
      }
    },
    [otherValue, props]
  );

  const onChangeOther = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(selected, e.target.value);
    },
    [onChange, selected]
  );

  const options = useMemo(() => {
    const output = [...props.options];
    if (props.hasOtherOptions) {
      output.push({
        title: "Other",
        value: OTHER_KEY
      });
    }
    if (props.optionsFilter) {
      return output.filter(option => toArray(props.optionsFilter).includes(option.meta));
    }
    return output;
  }, [props.options, props.hasOtherOptions, props.optionsFilter]);

  const internalError = useMemo(
    () =>
      otherSelected.current && isEmpty(otherValue)
        ? ({ type: "required", message: t("This field is required") } as FieldError)
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [otherSelected.current, otherValue, t]
  );
  useValueChanged(internalError, () => {
    if (internalError != null) props.onInternalError?.(internalError as ErrorOption);
  });

  const verifyDisableOption = useCallback(
    (title: string) => props?.disableOptionTitles?.includes(title),
    [props?.disableOptionTitles]
  );

  return (
    <div className={tw("space-y-2", props.containerClassName, variant.containerClassName)}>
      <Listbox value={selected} defaultValue={selected} onChange={onChange} multiple={props.multiSelect}>
        {({ open, value }) => {
          const valuesFormatted = formatSelectedValues(
            selected,
            options,
            value,
            props.showLabelAsMultiple,
            props.placeholder,
            props.multipleText
          );
          return (
            <>
              {props.label && (
                <Listbox.Label as={Fragment}>
                  <div className="flex items-baseline gap-1">
                    <InputLabel
                      required={props.required}
                      feedbackRequired={props.feedbackRequired}
                      className={props.labelClassName}
                      labelVariant={props.labelVariant}
                    >
                      {props.label}
                    </InputLabel>
                    {props.suffixLabelView && <div className="flex items-center">{props.suffixLabel}</div>}
                  </div>
                </Listbox.Label>
              )}
              {props.description && <InputDescription>{props.description}</InputDescription>}
              <Listbox.Button
                as="div"
                className={tw(
                  "flex h-10 items-center justify-between gap-3 rounded-lg px-3 py-2 hover:cursor-pointer",
                  props.error && "border border-error focus:border-error",
                  props.className,
                  variant.className
                )}
              >
                {props.prefix}
                <div
                  className={tw(
                    "flex items-center gap-2",
                    variant.titleContainerClassName,
                    props.titleContainerClassName
                  )}
                >
                  <Text
                    variant={props.inputVariant ?? "text-14-light"}
                    className={tw("w-full", variant.titleClassname, props.titleClassname)}
                    title={valuesFormatted}
                  >
                    {isEmpty(valuesFormatted) ? props.placeholder : valuesFormatted}
                  </Text>
                </div>
                {selected.length > 0 && showClear ? (
                  <div
                    className={variant.iconClearContainerClassName}
                    onClick={e => {
                      e.stopPropagation();
                      onChange([]);
                      onClear?.();
                    }}
                  >
                    <Icon
                      name={variant.iconNameClear ?? IconNames.CLEAR}
                      className={tw("fill-neutral-900", variant.iconClearClassName)}
                    />
                  </div>
                ) : (
                  <Icon
                    name={variant.iconName ?? IconNames.CHEVRON_DOWN}
                    className={tw("fill-neutral-900 transition", open && "rotate-180", variant.iconClassName)}
                  />
                )}
              </Listbox.Button>
              <Transition
                className="relative z-50 !m-0"
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
                  className={tw(
                    "border-light absolute mt-2 max-h-[235px] min-w-full overflow-auto rounded-lg bg-white outline-none lg:max-h-[250px] wide:max-h-[266px]",
                    props.optionsClassName,
                    variant.optionsClassName
                  )}
                >
                  {props.multiSelect && showSelectAll ? (
                    <>
                      <Listbox.Option
                        as="div"
                        key="all"
                        value="all"
                        className={classNames(
                          tw(
                            "w-full cursor-pointer p-3 hover:bg-primary-100",
                            selected.length === options.length && "bg-primary-100",
                            props.optionClassName
                          )
                        )}
                        disabled={verifyDisableOption("All")}
                      >
                        <div className="flex items-center justify-between">
                          <Checkbox
                            name=""
                            label="Select All"
                            textClassName={classNames(variant.optionLabelClassName, "whitespace-nowrap")}
                            inputClassName={classNames(variant.optionCheckboxClassName, "checked:bg-dash")}
                            className={tw("flex flex-row-reverse items-center gap-3", variant.optionClassName)}
                            checked={selected.length === options.length}
                            onChange={e => {
                              e.stopPropagation();
                              if (selected.length === options.length) {
                                onChange([]);
                              } else {
                                onChange(options.map(option => option.value));
                              }
                            }}
                          />
                        </div>
                      </Listbox.Option>
                      <hr className="mx-3 border-grey-350" />
                    </>
                  ) : null}
                  {options.map(option => {
                    const isSelected = selected?.includes(option.value);
                    return (
                      <Listbox.Option
                        as="div"
                        key={option.value}
                        value={option.value}
                        className={classNames(
                          tw(
                            "w-full cursor-pointer p-3 hover:bg-primary-100",
                            isSelected && !props.multiSelect && "bg-primary-100",
                            props.optionClassName,
                            verifyDisableOption(option.title) ? "cursor-not-allowed bg-grey-750 hover:bg-grey-750" : ""
                          )
                        )}
                        disabled={verifyDisableOption(option.title)}
                      >
                        {props.multiSelect ? (
                          <Checkbox
                            name=""
                            checked={isSelected}
                            label={option.title}
                            textClassName={variant.optionLabelClassName}
                            inputClassName={variant.optionCheckboxClassName}
                            className={tw("flex flex-row-reverse items-center gap-3", variant.optionClassName)}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            {option.prefix}
                            <Text
                              variant={`${props.optionVariant ?? "text-14-light"}`}
                              className={tw(
                                option.meta ? "w-[63%] break-words" : "break-words",
                                props.optionTextClassName
                              )}
                            >
                              {option.title}
                            </Text>
                          </div>
                        )}
                      </Listbox.Option>
                    );
                  })}
                </Listbox.Options>
              </Transition>
            </>
          );
        }}
      </Listbox>
      {otherSelected.current ? (
        <Input
          label={t("If other, please specify")}
          placeholder={t("Please specify")}
          name="other"
          type="text"
          defaultValue={otherValue}
          onChange={onChangeOther}
          error={internalError}
          hideErrorMessage
        />
      ) : null}
      <ErrorMessage error={internalError ?? props.error} />
    </div>
  );
};

export default Dropdown;
