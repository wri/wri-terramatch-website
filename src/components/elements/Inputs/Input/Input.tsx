import cn from "classnames";
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes, KeyboardEvent, Ref, useId } from "react";
import { UseFormReturn } from "react-hook-form";
import { When } from "react-if";
import { IconNames } from "src/components/extensive/Icon/Icon";

import { useEventListener } from "@/hooks/useEventListener";

import IconButton, { IconButtonProps } from "../../IconButton/IconButton";
import InputWrapper, { InputWrapperProps } from "../InputElements/InputWrapper";

export interface InputProps
  extends InputWrapperProps,
    Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "type" | "form"> {
  name: string;
  variant?: "secondary" | "default";
  form?: UseFormReturn<any>;
  clearable?: boolean;
  iconButtonProps?: IconButtonProps;
  type: HtmlInputType;
  hideErrorMessage?: boolean;
}

export type HtmlInputType =
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week"
  | "search"
  | "month"
  | "number"
  | "password"
  | "color"
  | "date"
  | "datetime-local"
  | "email";

const Input = forwardRef(
  (
    {
      variant = "default",
      form,
      clearable,
      className,
      iconButtonProps,
      hideErrorMessage,
      ...inputWrapperProps
    }: InputProps,
    ref?: Ref<HTMLInputElement>
  ) => {
    const { label, description, containerClassName, error, required, ...inputProps } = inputWrapperProps;
    const id = useId();

    const inputClasses = cn(
      className,
      "w-full outline-none transition-all duration-300 ease-in-out focus:ring-transparent",
      { "px-3 py-[9px] rounded-lg focus:border-primary-500": variant === "default" },
      { "border border-neutral-400": variant === "default" && !error },
      {
        "border-0 border-b py-[10px] pr-4 pl-0": variant === "secondary"
      },
      { "border-b-neutral-400": variant === "secondary" && !error },
      { ["border border-error focus:border-error"]: error }
    );

    const clearInput = () => form?.setValue(inputWrapperProps.name, "");
    const registeredFormProps = form?.register(inputWrapperProps.name);

    //To stop number input value changes on scroll
    useEventListener(id, "wheel", function () {
      //@ts-ignore
      document.activeElement?.blur();
    });

    if (!!clearable && !!form?.getValues(inputWrapperProps.name)) {
      //if input is clearable and it's not empty change iconButton to clear button
      iconButtonProps = {
        iconProps: {
          name: IconNames.X_CIRCLE,
          className: "fill-primary-500"
        },
        onClick: () => clearInput()
      };
    }

    const preventScientificNumbers = (e: KeyboardEvent<HTMLInputElement>) =>
      ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

    return (
      <InputWrapper
        inputId={id}
        label={label}
        description={description}
        containerClassName={containerClassName}
        error={!hideErrorMessage ? error : undefined}
        required={required}
      >
        <div className="relative">
          <input
            {...inputProps}
            {...registeredFormProps}
            onKeyDown={inputProps.type === "number" ? preventScientificNumbers : undefined}
            ref={registeredFormProps?.ref || ref}
            id={id}
            className={inputClasses}
            aria-invalid={!!error}
            aria-errormessage={error?.message}
            aria-describedby={`${id}-description`}
          />
          <When condition={!!iconButtonProps}>
            <IconButton {...iconButtonProps!} className="absolute right-3 top-[50%] translate-y-[-50%]" />
          </When>
        </div>
      </InputWrapper>
    );
  }
);

export default Input;
