import { Fragment, PropsWithChildren, useEffect, useId } from "react";
import { Else, If, Then } from "react-if";

import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import InputWrapper from "@/components/elements/Inputs/InputElements/InputWrapper";
import Radio from "@/components/elements/Inputs/Radio/Radio";
import { SelectProps } from "@/components/elements/Inputs/Select/Select";
import SelectImageLabel from "@/components/elements/Inputs/SelectImage/SelectImageLabel";
import List from "@/components/extensive/List/List";
import { useStateWithEffect } from "@/hooks/useStateWithEffect";
import { OptionValue } from "@/types/common";

export interface SelectImageProps extends SelectProps {}

/**
 * Notice: Use RHFSelectImage with React Hook Form
 * @param props PropsWithChildren<SelectImageProps>
 * @returns SelectImage component
 */
const SelectImage = (props: PropsWithChildren<SelectImageProps>) => {
  const id = useId();
  const [selected, setSelected, setSelectedWithoutEffect] = useStateWithEffect<OptionValue[]>(
    props.defaultValue || props.value || [],
    v => props.onChange(v)
  );

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
        className="mx-auto !mt-4 flex max-w-[573px] flex-wrap justify-center gap-4"
        itemAs={Fragment}
        items={props.options}
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
                  className="flex-row-reverse justify-end gap-3"
                  onClick={() => onChange(option.value)}
                  label={
                    <SelectImageLabel title={option.title} isSelected={isSelected} imageUrl={option.meta?.image_url} />
                  }
                />
              </Then>
              <Else>
                <Radio
                  checked={isSelected}
                  containerClassName="flex-row-reverse justify-end gap-3"
                  onClick={() => onChange(option.value)}
                  label={
                    <SelectImageLabel title={option.title} isSelected={isSelected} imageUrl={option.meta?.image_url} />
                  }
                />
              </Else>
            </If>
          );
        }}
      />
    </InputWrapper>
  );
};

export default SelectImage;
