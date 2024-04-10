import { ReactNode } from "react";
import { When } from "react-if";

import ErrorMessage from "../ErrorMessage/ErrorMessage";
import InputDescription from "./InputDescription";
import InputLabel from "./InputLabel";

interface InputWrapperProps {
  containerClassName?: string;
  error?: { message: string };
  feedbackRequired?: boolean;
  hideErrorMessage?: boolean;
  inputId?: string;
  label?: string;
  required?: boolean;
  variant?: {
    constent?: string;
    label?: string;
    description?: string;
  };
  inputValue?: string;
  description?: ReactNode;
  children?: ReactNode;
}

const InputWrapper: React.FC<InputWrapperProps> = props => {
  return (
    <div className={`${props.containerClassName} relative ${props.variant.constent} flex flex-col gap-2`}>
      <InputLabel
        htmlFor={props.inputId}
        required={props.required}
        variant={props.variant.label}
        className={props.variant.label}
      >
        {props.label}
      </InputLabel>
      {props.children}
      <When condition={!!props.error && !props.hideErrorMessage}>
        <ErrorMessage error={props.error} className="mt-2" />
      </When>
      <When condition={!!props.description}>
        <InputDescription className={props.variant.description || ""}>{props.description}</InputDescription>
      </When>
    </div>
  );
};

export default InputWrapper;
