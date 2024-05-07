import cn from "classnames";
import { DetailedHTMLProps, TextareaHTMLAttributes, useId } from "react";
import { UseFormReturn } from "react-hook-form";

import InputWrapper, { InputWrapperProps } from "@/components/elements/Inputs/InputElements/InputWrapper";

export interface TextAreaProps
  extends InputWrapperProps,
    Omit<DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, "form"> {
  name: string;
  formHook?: UseFormReturn<any>;
}

const TextArea = ({ formHook, className, ...inputWrapperProps }: TextAreaProps) => {
  const { label, description, containerClassName, error, required, feedbackRequired, ...inputProps } =
    inputWrapperProps;
  const id = useId();
  const inputClasses = cn(
    "min-h-[150px] w-full rounded-lg px-3 py-2 focus:border-primary-500 outline-none transition-all duration-300 ease-in-out focus:ring-transparent",
    { className: className },
    { "border-light ": !error },
    { ["border border-error focus:border-error"]: error }
  );
  if (error && formHook?.watch(inputWrapperProps.name)) {
    formHook && formHook.trigger();
    formHook && formHook.reset(formHook.getValues());
  }
  return (
    <InputWrapper
      inputId={id}
      label={label}
      description={description}
      containerClassName={containerClassName}
      error={error}
      required={required}
      feedbackRequired={feedbackRequired}
    >
      <textarea {...inputProps} {...formHook?.register(inputWrapperProps.name)} id={id} className={inputClasses} />
    </InputWrapper>
  );
};

export default TextArea;
