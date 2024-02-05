import { RadioGroup as HeadlessRadioGroup } from "@headlessui/react";

import InputWrapper, { InputWrapperProps } from "@/components/elements/Inputs/InputElements/InputWrapper";
import Radio from "@/components/elements/Inputs/Radio/Radio";
import { OptionValueWithBoolean, OptionWithBoolean } from "@/types/common";

export interface RadioGroupProps extends InputWrapperProps {
  options: OptionWithBoolean[];
  value?: OptionValueWithBoolean;
  onChange?: (value: OptionValueWithBoolean) => void;
}

const RadioGroup = ({ value, onChange, options, ...inputWrapperProps }: RadioGroupProps) => {
  return (
    <InputWrapper {...inputWrapperProps}>
      <HeadlessRadioGroup value={value} onChange={onChange} className="space-y-2">
        {options.map(option => (
          <HeadlessRadioGroup.Option key={option.title} value={option.value}>
            {({ checked }) => (
              <div className="rounded-lg border border-neutral-400 py-2 px-3">
                <Radio
                  label={option.title}
                  checked={checked}
                  onChange={() => onChange && onChange(option.value)}
                  className="flex flex-row-reverse items-center justify-end gap-3 "
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
