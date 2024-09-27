import classNames from "classnames";
import { InputHTMLAttributes, ReactNode, useId } from "react";

import Text from "@/components/elements/Text/Text";
import { TextVariants } from "@/types/common";

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string | ReactNode;
  variantText?: TextVariants;
  labelRadio?: string;
}

const Radio = (props: RadioProps) => {
  const id = useId();

  if (typeof props.label !== "string") {
    return (
      <label htmlFor={id} className={classNames("relative", props.className, props.labelRadio)}>
        {props.label}
        <input {...props} id={id} type="radio" className="absolute top-0 opacity-0" />
      </label>
    );
  }

  return (
    <label htmlFor={id} className={classNames("flex items-center", props.className, props.labelRadio)}>
      <Text variant={props.variantText ? props.variantText : "text-light-caption-200"}>{props.label}</Text>
      <input {...props} id={id} type="radio" />
    </label>
  );
};

export default Radio;
