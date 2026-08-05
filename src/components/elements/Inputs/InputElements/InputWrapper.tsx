import { useT } from "@transifex/react";
import classNames from "classnames";
import { PropsWithChildren } from "react";
import { FieldError } from "react-hook-form";

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
  error?: FieldError;
  required?: boolean;
  feedbackRequired?: boolean;
  labelClassName?: string;
  descriptionClassName?: string;
  suffixLabelView?: boolean;
  classNameError?: string;
}

const InputWrapper = (props: PropsWithChildren<InputWrapperProps>) => {
  const t = useT();
  return (
    <div className={classNames(props.containerClassName, "relative space-y-2")}>
      <InputLabel
        htmlFor={props.inputId}
        required={props.required}
        feedbackRequired={props.feedbackRequired}
        labelVariant={props.labelVariant}
        className={props.labelClassName}
        suffixLabelView={props.suffixLabelView}
      >
        {t(props.label)}
      </InputLabel>
      <InputDescription id={props.inputId && `${props.inputId}-description`} className={props.descriptionClassName}>
        {t(props.description)}
      </InputDescription>
      {props.children}
      <InputDescription id={props.inputId && `${props.inputId}-description`} className={props.descriptionClassName}>
        {t(props.descriptionFooter)}
      </InputDescription>
      <ErrorMessage error={props.error} className={classNames("mt-2", props.classNameError)} />
    </div>
  );
};

export default InputWrapper;
