import classNames from "classnames";
import { PropsWithChildren } from "react";
import { FieldError } from "react-hook-form";

import ErrorMessage from "@/components/elements/ErrorMessage/ErrorMessage";

import InputDescription from "./InputDescription";
import InputLabel from "./InputLabel";

export interface InputWrapperProps {
  inputId?: string;
  label?: string;
  description?: string;
  containerClassName?: string;
  error?: FieldError;
  required?: boolean;
}

const InputWrapper = (props: PropsWithChildren<InputWrapperProps>) => {
  return (
    <div className={classNames(props.containerClassName, "relative space-y-2")}>
      <InputLabel htmlFor={props.inputId} required={props.required}>
        {props.label}
      </InputLabel>
      <InputDescription id={props.inputId && `${props.inputId}-description`}>{props.description}</InputDescription>
      {props.children}
      <ErrorMessage error={props.error} className="mt-2" />
    </div>
  );
};

export default InputWrapper;
