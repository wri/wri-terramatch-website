import cn from "classnames";
import { ChangeEvent, DetailedHTMLProps, TextareaHTMLAttributes, useCallback, useId, useState } from "react";
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
  const {
    label,
    description,
    containerClassName,
    error,
    required,
    feedbackRequired,
    labelClassName,
    labelVariant,
    ...inputProps
  } = inputWrapperProps;
  const id = useId();
  const inputClasses = cn(
    "min-h-[150px] w-full rounded-lg px-3 py-2 focus:border-primary-500 outline-none transition-all duration-300 ease-in-out focus:ring-transparent",
    className,
    { "border-light ": !error },
    { ["border border-error focus:border-error"]: error }
  );
  useEffect(() => {
    if (inputProps.value === "") {
      setTextValue("");
    }
  }, [inputProps.value]);

  const [textValue, setTextValue] = useState("");
  const handleTextAreaChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      externalOnChange?.(event);
      setTextValue(event.target.value);
    },
    [externalOnChange, setTextValue]
  );
  const { textareaProps } = useTextAreaAuto(handleTextAreaChange, textValue?.toString());
  const mergedProps = { ...inputProps, ...textareaProps };

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
