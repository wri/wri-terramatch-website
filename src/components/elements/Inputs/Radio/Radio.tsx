import classNames from "classnames";
import { InputHTMLAttributes, ReactNode, useId } from "react";

import Text from "@/components/elements/Text/Text";
import { TextVariants } from "@/types/common";

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string | ReactNode;
  variantText?: TextVariants;
  labelRadio?: string;
}

const Radio = ({ label, variantText, labelRadio, ...inputProps }: RadioProps) => {
  const id = useId();

  if (typeof label !== "string") {
    return (
      <label htmlFor={id} className={classNames("relative", inputProps.className, labelRadio)}>
        {label}
        <input {...inputProps} id={id} type="radio" className="absolute top-0 opacity-0" />
      </label>
    );
  }

  return (
    <label htmlFor={id} className={classNames("flex items-center", inputProps.className, labelRadio)}>
      <Text variant={variantText != null ? variantText : "text-light-caption-200"}>{label}</Text>
      <input {...inputProps} id={id} type="radio" />
    </label>
  );
};

export default Radio;
