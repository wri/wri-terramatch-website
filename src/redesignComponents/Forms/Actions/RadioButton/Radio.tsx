import { Radio as WriRadio, RadioGroup as WriRadioGroup } from "@worldresources/wri-design-systems";
import type { FC } from "react";

import type { RadioButtonGroupProps, RadioGroupProps, RadioProps } from "./types";

export const Radio: FC<RadioProps> = ({ children, ...props }) => <WriRadio {...props}>{children}</WriRadio>;

export const RadioGroup: FC<RadioGroupProps> = props => <WriRadioGroup {...props} />;

type CustomColorStyles = {
  "& label .ds-radio-item-indicator": { borderColor: string };
  "& label .ds-radio-item-indicator[data-checked]": { borderColor: string; color: string };
};

const WriRadioGroupWithCss: FC<RadioGroupProps & { css?: CustomColorStyles }> = WriRadioGroup;

const RadioButtonGroup: FC<RadioButtonGroupProps> = ({ options, color, ...groupProps }) => {
  const customColorStyles: CustomColorStyles | undefined = color
    ? {
        "& label .ds-radio-item-indicator": { borderColor: color },
        "& label .ds-radio-item-indicator[data-checked]": { borderColor: color, color }
      }
    : undefined;

  return (
    <WriRadioGroupWithCss {...groupProps} css={customColorStyles}>
      {options.map(option => (
        <Radio key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </Radio>
      ))}
    </WriRadioGroupWithCss>
  );
};

export default RadioButtonGroup;
