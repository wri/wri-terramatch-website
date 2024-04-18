import { Listbox, Transition } from "@headlessui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { uniq } from "lodash";
import { ChangeEvent, Fragment, PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import { ErrorOption, FieldError, UseFormReturn } from "react-hook-form";
import { Else, If, Then, When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import ErrorMessage from "@/components/elements/ErrorMessage/ErrorMessage";
import Input from "@/components/elements/Inputs/Input/Input";
import InputDescription from "@/components/elements/Inputs/InputElements/InputDescription";
import InputLabel from "@/components/elements/Inputs/InputElements/InputLabel";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { Option, OptionValue, TextVariants } from "@/types/common";
import { toArray } from "@/utils/array";
import { formatOptionsList, statusColor } from "@/utils/options";

import Status from "../../Status/Status";
import Text from "../../Text/Text";
import Checkbox from "../Checkbox/Checkbox";

export interface DropdownProps {
  label?: string;
  labelClassName?: string;
  labelVariant?: TextVariants;
  description?: string;
  placeholder?: string;
  value?: OptionValue[];
  options: Option[];
  iconName?: IconNames;
  className?: string;
  optionClassName?: string;
  containerClassName?: string;
  defaultValue?: OptionValue[];
  required?: boolean;
  error?: FieldError;
  multiSelect?: boolean;
  hasOtherOptions?: boolean;
  optionsFilter?: string;
  feedbackRequired?: boolean;
  formHook?: UseFormReturn;
  onChangeConfirm?: boolean;
  setOnChangeConfirm?: (confirm: boolean) => void;
  onChange: (value: OptionValue[]) => void;
  onInternalError?: (error: ErrorOption) => void;
}
const otherKey = "other#value#key";
const getAllowedValues = (values: OptionValue[], options: Option[]) =>
  uniq(values.filter(v => options.find(o => o.value === v)).filter(v => !!v));
const getDefaultDropDownValue = (values: OptionValue[], options: Option[], hasOtherOptions: boolean) => {
  const defaultValue = getAllowedValues(values, options);
  const defaultOtherValue = getDefaultOtherValue(values, options, hasOtherOptions);
  if (defaultOtherValue) defaultValue.push(otherKey);
  return defaultValue;
};
const getDefaultOtherValue = (values: OptionValue[], options: Option[], hasOtherOptions: boolean) =>
  (hasOtherOptions && values.filter(v => !options.find(o => o.value === v))?.[0]) || "";
/**
 * Notice: Please use RHFDropdown with React Hook Form
 * @param props PropsWithChildren<DropdownProps>
 * @returns Dropdown component
 */
const Dropdown = (props: PropsWithChildren<DropdownProps>) => {
  const t = useT();
  const [selected, setSelected] = useState<OptionValue[]>(() =>
    getDefaultDropDownValue(props.defaultValue || props.value || [], props.options, !!props.hasOtherOptions)
  );
  const [otherValue, setOtherValue] = useState<OptionValue>(() =>
    getDefaultOtherValue(props.defaultValue || props.value || [], props.options, !!props.hasOtherOptions)
  );
  const updateControl = useRef(0);
  useEffect(() => {
    if (!!props.value && !!props.options && updateControl.current < 5) {
      setSelected(getDefaultDropDownValue(props.value, props.options, !!props.hasOtherOptions));
      setOtherValue(getDefaultOtherValue(props.value, props.options, !!props.hasOtherOptions));
      updateControl.current++;
    }
  }, [props.value, props.options, props.hasOtherOptions]);
  const onChange = async (value: OptionValue | OptionValue[], _otherValue?: string) => {
    let otherStr = typeof _otherValue === "string" ? _otherValue : otherValue;
    if (Array.isArray(value)) {
      if (props.onChangeConfirm) {
        setSelected(value);
        if (props.setOnChangeConfirm) {
          props.setOnChangeConfirm(false);
        }
      }
      const allowedValues = getAllowedValues(value, props.options);
      props.onChange(
        props.hasOtherOptions && otherStr && value.includes(otherKey) ? [...allowedValues, otherStr] : allowedValues
      );
    } else if (value) {
      const allowedValues = getAllowedValues([value], props.options);
      setSelected([value]);
      props.onChange(props.hasOtherOptions && otherStr && value === otherKey ? [otherStr] : allowedValues);
    } else {
      setSelected([]);
    }
  };
  const onChangeOther = (e: ChangeEvent<HTMLInputElement>) => {
    setOtherValue(e.target.value);
    onChange(selected, e.target.value);
  };
  useEffect(() => {
    props.formHook?.trigger();
  }, [props.formHook, selected]);
  const options = useMemo(() => {
    const output = [...props.options];
    if (props.hasOtherOptions) {
      output.push({
        title: "Other",
        value: otherKey
      });
    }
    if (props.optionsFilter) {
      return output.filter(option => toArray(props.optionsFilter).includes(option.meta));
    }
    return output;
  }, [props.options, props.hasOtherOptions, props.optionsFilter]);
  const otherIsSelected = useMemo(() => selected?.includes(otherKey), [selected]);
  const internalError = useMemo(() => {
    const error =
      otherIsSelected && !otherValue
        ? ({ type: "required", message: t("This field is required") } as FieldError)
        : undefined;
    props.onInternalError?.(error as ErrorOption);
    return error;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherIsSelected, otherValue, t]);

  const getColorStatus = (option: string): string => {
    const colorMap: { [key: string]: string } = {
      Approved: "bg-secondary",
      Submitted: "bg-blue",
      Draft: "bg-purple",
      "Under Review": "bg-tertiary-600"
    };

    return colorMap[option] || "";
  };

  return (
    <div className={classNames("space-y-2", props.containerClassName)}>
      <Listbox value={selected} defaultValue={selected} onChange={onChange} multiple={props.multiSelect}>
        {({ open, value }) => (
          <>
            <When condition={!!props.label}>
              <Listbox.Label as={Fragment}>
                <InputLabel
                  required={props.required}
                  feedbackRequired={props.feedbackRequired}
                  className={props.labelClassName}
                  labelVariant={props.labelVariant}
                >
                  {props.label}
                </InputLabel>
              </Listbox.Label>
            </When>
            <When condition={!!props.description}>
              <InputDescription>{props.description}</InputDescription>
            </When>
            <Listbox.Button
              as="div"
              className={classNames(
                "flex h-10 items-center justify-between gap-3 rounded-lg py-2 px-3 hover:cursor-pointer",
                !props.error && "border-light",
                props.error && "border border-error focus:border-error",
                props.className
              )}
            >
              <div className="flex items-center gap-2">
                <When condition={options[0].meta}>
                  <div
                    className={`min-h-[8px] min-w-[8px] rounded-full ${getColorStatus(
                      statusColor(options, toArray<any>(value)) ?? ""
                    )}`}
                  />
                </When>
                <Text variant="text-14-light" className="w-full line-clamp-1">
                  {formatOptionsList(options, toArray<any>(value)) || props.placeholder}
                </Text>
              </div>

              <Icon
                name={props.iconName || IconNames.CHEVRON_DOWN}
                className={classNames("fill-neutral-900 transition", open && "rotate-180")}
                width={16}
              />
            </Listbox.Button>
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
                className="border-light absolute mt-2 max-h-[400px] min-w-full overflow-auto rounded-lg bg-white"
              >
                {options.map(option => {
                  let isSelected;
                  if (typeof selected === "string" || Array.isArray(selected)) {
                    isSelected = selected?.includes(option.value);
                  } else {
                    isSelected = selected === option.value;
                  }
                  return (
                    <Listbox.Option
                      as="div"
                      key={option.value}
                      value={option.value}
                      className={classNames(
                        "w-full cursor-pointer hover:bg-primary-100",
                        props.multiSelect ? "p-3.5" : "p-3",
                        isSelected && !props.multiSelect && "bg-primary-100"
                      )}
                    >
                      <If condition={props.multiSelect}>
                        <Then>
                          <Checkbox
                            name=""
                            checked={isSelected}
                            label={option.title}
                            className="flex-row-reverse justify-end gap-3"
                          />
                        </Then>
                        <Else>
                          <div className="flex items-center gap-2">
                            <Text variant="text-14-light" className={tw("w-[65%] break-words", props.optionClassName)}>
                              {option.title}
                            </Text>
                            <When condition={option.meta}>
                              <Status className="w-[35%]" status={option.meta} />
                            </When>
                          </div>
                        </Else>
                      </If>
                    </Listbox.Option>
                  );
                })}
              </Listbox.Options>
            </Transition>
          </>
        )}
      </Listbox>
      <When condition={otherIsSelected}>
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
      </When>
      <ErrorMessage error={internalError || props.error} />
    </div>
  );
};
export default Dropdown;
