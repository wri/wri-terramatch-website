import type { Radio as WriRadio, RadioGroup as WriRadioGroup } from "@worldresources/wri-design-systems";
import type { ComponentProps, ReactNode } from "react";

export type RadioProps = ComponentProps<typeof WriRadio> & {
  children?: ReactNode;
};

export type RadioGroupProps = ComponentProps<typeof WriRadioGroup>;

export type RadioOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type RadioButtonGroupProps = RadioGroupProps & {
  options: RadioOption[];
  color?: string;
  css?: any;
};
