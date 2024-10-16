import { RadioGroup as HeadlessRadioGroup } from "@headlessui/react";
import classNames from "classnames";

import InputWrapper, { InputWrapperProps } from "@/components/elements/Inputs/InputElements/InputWrapper";
import Radio from "@/components/elements/Inputs/Radio/Radio";
import { OptionValueWithBoolean, OptionWithBoolean, TextVariants } from "@/types/common";

export interface RadioGroupProps extends InputWrapperProps {
  options: OptionWithBoolean[];
  value?: OptionValueWithBoolean;
  onChange?: (value: OptionValueWithBoolean) => void;
  contentClassName?: string;
  radioClassName?: string;
  contentRadioClassName?: string;
  variantTextRadio?: TextVariants;
  labelRadio?: string;
}

const RadioGroup = ({
  value,
  onChange,
  options,
  contentClassName,
  radioClassName,
  contentRadioClassName,
  variantTextRadio,
  ...inputWrapperProps
}: RadioGroupProps) => {
  return (
    <InputWrapper {...inputWrapperProps}>
      <HeadlessRadioGroup value={value} onChange={onChange} className={classNames("space-y-2", contentClassName)}>
        {options.map(option => (
          <HeadlessRadioGroup.Option key={option.title} value={option.value}>
            {({ checked }) => (
              <div className={classNames("rounded-lg border border-neutral-400 px-3 py-2", contentRadioClassName)}>
                <Radio
                  label={option.title}
                  checked={checked}
                  onChange={() => onChange && onChange(option.value)}
                  className={classNames("flex flex-row-reverse items-center justify-end gap-3 ")}
                  variantText={variantTextRadio}
                  labelRadio={radioClassName}
                />
              </div>
            )}
          </HeadlessRadioGroup.Option>
        ))}
      </HeadlessRadioGroup>
    </InputWrapper>
  );
};

export default RadioGroup;
