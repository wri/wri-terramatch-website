import classNames from "classnames";
import { PropsWithChildren } from "react";
import { FieldError } from "react-hook-form";
import { When } from "react-if";

import ErrorMessage from "@/components/elements/ErrorMessage/ErrorMessage";
import { TextVariants } from "@/types/common";

import InputDescription from "./InputDescription";
import InputLabel from "./InputLabel";

export interface InputWrapperProps {
  inputId?: string;
  label?: string;
  description?: string;
  descriptionFooter?: string;
  containerClassName?: string;
  labelVariant?: TextVariants;
  labelClassname?: string;
  error?: FieldError;
  required?: boolean;
  feedbackRequired?: boolean;
  labelClassName?: string;
  descriptionClassName?: string;
}

const InputWrapper = (props: PropsWithChildren<InputWrapperProps>) => {
  return (
    <div className={classNames(props.containerClassName, "relative space-y-2")}>
      <InputLabel
        htmlFor={props.inputId}
        required={props.required}
        feedbackRequired={props.feedbackRequired}
        labelVariant={props.labelVariant}
        className={props.labelClassname}
      >
        {props.label}
      </InputLabel>
      <InputDescription id={props.inputId && `${props.inputId}-description`} className={props.descriptionClassName}>
        {props.description}
      </InputDescription>
      {props.children}
      <When condition={props.descriptionFooter}>
        <InputDescription id={props.inputId && `${props.inputId}-description`} className={props.descriptionClassName}>
          {props.descriptionFooter}
        </InputDescription>
      </When>
      <ErrorMessage error={props.error} className="mt-2" />
    </div>
  );
};

export default InputWrapper;
