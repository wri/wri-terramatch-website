import { FC, Fragment, PropsWithChildren, useEffect, useId } from "react";

import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import InputWrapper from "@/components/elements/Inputs/InputElements/InputWrapper";
import Radio from "@/components/elements/Inputs/Radio/Radio";
import { SelectProps } from "@/components/elements/Inputs/Select/Select";
import SelectImageLabel from "@/components/elements/Inputs/SelectImage/SelectImageLabel";
import List from "@/components/extensive/List/List";
import { useStateWithEffect } from "@/hooks/useStateWithEffect";
import { OptionValue } from "@/types/common";

const SELECT_IMAGE_FALLBACK_URL_BY_VALUE: Record<string, string> = {
  "sapling-planting": "/images/options/restoration-strategies/tree-planting.png"
};

export interface SelectImageProps extends SelectProps {}

/**
 * Notice: Use RHFSelectImage with React Hook Form
 */
const SelectImage: FC<PropsWithChildren<SelectImageProps>> = props => {
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
      feedbackRequired={props.feedbackRequired}
    >
      <List
        as="div"
        className="mx-auto !mt-4 flex max-w-[573px] flex-wrap items-start justify-center gap-4"
        itemAs={Fragment}
        items={props.options}
        render={option => {
          const isSelected =
            typeof selected === "string" || Array.isArray(selected)
              ? selected?.includes(option.value)
              : selected === option.value;
          const imageUrl =
            option.meta?.image?.thumb_url ??
            option.meta?.url ??
            option.meta?.image_url ??
            SELECT_IMAGE_FALLBACK_URL_BY_VALUE[String(option.value)];

          return props.multiSelect ? (
            <Checkbox
              name=""
              checked={isSelected}
              className="flex-row-reverse justify-end gap-3"
              onClick={() => onChange(option.value)}
              label={<SelectImageLabel title={option.title} isSelected={isSelected} imageUrl={imageUrl} />}
            />
          ) : (
            <Radio
              checked={isSelected}
              className="flex-row-reverse justify-end gap-3"
              onClick={() => onChange(option.value)}
              label={<SelectImageLabel title={option.title} isSelected={isSelected} imageUrl={imageUrl} />}
            />
          );
        }}
      />
    </InputWrapper>
  );
};

export default SelectImage;
