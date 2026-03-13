import { Radio as WriRadio, RadioGroup as WriRadioGroup } from "@worldresources/wri-design-systems";
import type { FC } from "react";

import type { RadioButtonGroupProps, RadioGroupProps, RadioProps } from "./types";

export const Radio: FC<RadioProps> = ({ children, ...props }) => <WriRadio {...props}>{children}</WriRadio>;

export const RadioGroup: FC<RadioGroupProps> = props => <WriRadioGroup {...props} />;

const RadioButtonGroup: FC<RadioButtonGroupProps> = ({ options, ...groupProps }) => (
  <WriRadioGroup {...groupProps}>
    {options.map(option => (
      <Radio key={option.value} value={option.value} disabled={option.disabled}>
        {option.label}
      </Radio>
    ))}
  </WriRadioGroup>
);

export default RadioButtonGroup;
