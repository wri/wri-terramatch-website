import { Radio as WriRadio, RadioGroup as WriRadioGroup } from "@worldresources/wri-design-systems";
import type { FC } from "react";

import { getThemedColor } from "@/lib/theme";

import type { RadioButtonGroupProps, RadioGroupProps, RadioProps } from "./types";

export const Radio: FC<RadioProps> = ({ children, ...props }) => <WriRadio {...props}>{children}</WriRadio>;

export const RadioGroup: FC<RadioGroupProps> = props => <WriRadioGroup {...props} />;

const WriRadioGroupWithCss: FC<RadioGroupProps & { css?: any }> = WriRadioGroup;

const RadioButtonGroup: FC<RadioButtonGroupProps> = ({ options, css, color, ...groupProps }) => {
  const styles = {
    "& label .ds-radio-item-indicator": { backgroundColor: "transparent !important", borderColor: color },
    "& label .ds-radio-item-indicator[data-checked]": {
      backgroundColor: "transparent !important",
      borderColor: color ?? getThemedColor("primary", 700),
      color: color ?? getThemedColor("primary", 700)
    },
    ...css
  };
  return (
    <WriRadioGroupWithCss {...groupProps} css={styles}>
      {options.map(option => (
        <Radio key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </Radio>
      ))}
    </WriRadioGroupWithCss>
  );
};

export default RadioButtonGroup;
