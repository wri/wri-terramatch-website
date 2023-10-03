import { Fragment, PropsWithChildren, useEffect, useId } from "react";
import { FieldError } from "react-hook-form";
import { Else, If, Then } from "react-if";

import List from "@/components/extensive/List/List";
import { useStateWithEffect } from "@/hooks/useStateWithEffect";
import { Option, OptionValue } from "@/types/common";

import Checkbox from "../Checkbox/Checkbox";
import InputWrapper, { InputWrapperProps } from "../InputElements/InputWrapper";
import Radio from "../Radio/Radio";

export interface SelectProps extends InputWrapperProps {
  inputId?: string;
  containerClassName?: string;
  label?: string;
  description?: string;
  placeholder?: string;
  className?: string;
  options: Option[];
  optionsFilter?: string | string[];
  defaultValue?: OptionValue[];
  required?: boolean;
  value?: OptionValue[];
  error?: FieldError;
  multiSelect?: boolean;
  onChange: (value: OptionValue[]) => void;
}

/**
 * Notice: Use RHFSelect with React Hook Form
 * @param props PropsWithChildren<SelectProps>
 * @returns Select component
 */
const Select = (props: PropsWithChildren<SelectProps>) => {
  const id = useId();
  const [selected, setSelected, setSelectedWithoutEffect] = useStateWithEffect<OptionValue[]>(
    props.defaultValue || props.value || [],
    v => props.onChange(v)
  );

  const options = props.optionsFilter
    ? props.options.filter(option => props.optionsFilter?.includes(option.meta))
    : props.options;

  useEffect(() => {
    if (props.value) {
      if (Array.isArray(props.value)) {
        setSelectedWithoutEffect(props.value);
      } else {
        setSelectedWithoutEffect([props.value]);
      }
    }
  }, [props.value, setSelectedWithoutEffect]);

  const onChange = (value: OptionValue) => {
    if (props.multiSelect) {
      setSelected(selected => {
        const _tmp = [...(selected || [])];
        const index = _tmp?.indexOf(value);
        if (index === -1) {
          _tmp.push(value);
        } else {
          _tmp.splice(index, 1);
        }
        return _tmp;
      });
    } else {
      setSelected([value]);
    }
  };

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      containerClassName={props.containerClassName}
      description={props.description}
      inputId={id}
      error={props.error}
    >
      <List
        as="div"
        className="space-y-3"
        itemAs={Fragment}
        items={options}
        render={option => {
          let isSelected;
          if (typeof selected === "string" || Array.isArray(selected)) {
            isSelected = selected?.includes(option.value);
          } else {
            isSelected = selected === option.value;
          }
          return (
            <If condition={props.multiSelect}>
              <Then>
                <Checkbox
                  name=""
                  checked={isSelected}
                  label={option.title}
                  className="flex-row-reverse justify-end gap-3"
                  onClick={() => onChange(option.value)}
                />
              </Then>
              <Else>
                <Radio
                  checked={isSelected}
                  label={option.title}
                  containerClassName="flex-row-reverse justify-end gap-3"
                  onClick={() => onChange(option.value)}
                />
              </Else>
            </If>
          );
        }}
      />
    </InputWrapper>
  );
};

export default Select;
