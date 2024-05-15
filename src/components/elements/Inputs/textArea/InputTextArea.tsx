import cn from "classnames";
import { ChangeEvent, DetailedHTMLProps, TextareaHTMLAttributes, useId } from "react";
import { UseFormReturn } from "react-hook-form";

import InputWrapper, { InputWrapperProps } from "@/components/elements/Inputs/InputElements/InputWrapper";

interface InputTextAreaProps
  extends InputWrapperProps,
    Omit<DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, "form"> {
  name: string;
  formHook?: UseFormReturn<any>;
}

const InputTextArea = ({ formHook, className, ...inputProps }: InputTextAreaProps) => {
  const {
    label,
    description,
    containerClassName,
    error,
    required,
    feedbackRequired,
    labelClassName,
    labelVariant,
    ...textareaProps
  } = inputProps;
  const id = useId();
  const inputClasses = cn(
    "min-h-[150px] w-full rounded-lg px-3 py-2 focus:border-primary-500 outline-none transition-all duration-300 ease-in-out focus:ring-transparent",
    className,
    { "border-light ": !error },
    { ["border border-error focus:border-error"]: error }
  );

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (inputProps.onChange) {
      inputProps.onChange(event);
    }
  };

  return (
    <InputWrapper
      inputId={id}
      label={label}
      labelClassName={labelClassName}
      labelVariant={labelVariant}
      description={description}
      containerClassName={containerClassName}
      error={error}
      required={required}
      feedbackRequired={feedbackRequired}
    >
      <textarea
        {...textareaProps}
        onChange={handleInputChange}
        {...formHook?.register(inputProps.name)}
        id={id}
        className={inputClasses}
      />
    </InputWrapper>
  );
};

export default InputTextArea;
