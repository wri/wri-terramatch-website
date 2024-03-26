import cn from "classnames";
import { ChangeEvent, DetailedHTMLProps, TextareaHTMLAttributes, useId, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import InputWrapper, { InputWrapperProps } from "@/components/elements/Inputs/InputElements/InputWrapper";

import { useTextAreaAuto } from "./TextArea.hooks";

export interface TextAreaProps
  extends InputWrapperProps,
    Omit<DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, "form"> {
  name: string;
  formHook?: UseFormReturn<any>;
}

const TextArea = ({ formHook, className, onChange: externalOnChange, ...inputWrapperProps }: TextAreaProps) => {
  const { label, description, containerClassName, error, required, feedbackRequired, ...inputProps } =
    inputWrapperProps;
  const id = useId();
  const inputClasses = cn(
    "min-h-[150px] w-full rounded-lg px-3 py-2 focus:border-primary-500 outline-none transition-all duration-300 ease-in-out focus:ring-transparent",
    className,
    { "border-light ": !error },
    { ["border border-error focus:border-error"]: error }
  );

  const [textValue, setTextValue] = useState("");
  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (externalOnChange) {
      externalOnChange(event);
    }
    setTextValue(event.target.value);
  };
  const { textareaProps } = useTextAreaAuto(handleTextAreaChange, textValue?.toString());
  const mergedProps = { ...inputProps, ...textareaProps };
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
      <textarea
        {...mergedProps}
        onChange={handleTextAreaChange}
        {...formHook?.register(inputWrapperProps.name)}
        id={id}
        className={inputClasses}
      />
    </InputWrapper>
  );
};

export default TextArea;
