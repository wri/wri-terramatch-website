import { InputHTMLAttributes, ReactNode, useId } from "react";

import Text from "@/components/elements/Text/Text";

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string | ReactNode;
}

const Radio = (props: RadioProps) => {
  const id = useId();

  if (typeof props.label !== "string") {
    return (
      <label htmlFor={id} className={`relative ${props.className}`}>
        {props.label}
        <input {...props} id={id} type="radio" className="absolute top-0 opacity-0" />
      </label>
    );
  }

  return (
    <label htmlFor={id} className={`flex items-center ${props.className}`}>
      <Text variant="text-light-caption-200">{props.label}</Text>
      <input {...props} id={id} type="radio" />
    </label>
  );
};

export default Radio;
