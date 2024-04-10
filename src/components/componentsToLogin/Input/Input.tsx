"use client";
import React, { ChangeEvent, useState } from "react";

import { InputVariant } from "./InputVariant";
import InputWrapper from "./InputWrapper";

interface InputProps {
  id?: string;
  label: string;
  description?: React.ReactNode;
  placeholder?: string;
  containerClassName?: string;
  hideErrorMessage?: boolean;
  error?: { message: string };
  type: string;
  feedbackRequired?: boolean;
  variant: InputVariant;
  required?: boolean;
  onInputChange?: (value: string) => void;
  value?: string;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = props => {
  const {
    id,
    label,
    description,
    disabled,
    placeholder,
    containerClassName,
    hideErrorMessage,
    error,
    type,
    feedbackRequired,
    variant,
    value,
    required,
    onInputChange = () => {}
  } = props;
  const [inputValue, setInputValue] = useState<string>(value ? value : "");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onInputChange(e.target.value);
  };

  return (
    <InputWrapper
      inputId={id}
      label={label}
      description={description}
      containerClassName={inputValue.length > 0 ? "input-content-login" : containerClassName}
      required={required}
      error={!hideErrorMessage ? error : undefined}
      feedbackRequired={feedbackRequired}
      variant={variant}
      inputValue={inputValue}
    >
      <input
        id={id}
        type={type}
        className={`${variant.input} outline-none`}
        aria-invalid={!!error}
        aria-errormessage={error?.message}
        onChange={handleInputChange}
        placeholder={placeholder}
        value={inputValue}
        disabled={disabled}
      />
    </InputWrapper>
  );
};

export default Input;
