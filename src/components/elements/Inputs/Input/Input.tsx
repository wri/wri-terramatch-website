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
  variant?: "secondary" | "default" | "login" | "signup";
  formHook?: UseFormReturn<any>;
  clearable?: boolean;
  iconButtonProps?: IconButtonProps;
  type: HtmlInputType;
  hideErrorMessage?: boolean;
  customVariant?: any;
  labelClassName?: string;
  descriptionClassName?: string;
  descriptionFooter?: string;
  format?: "number";
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
  | "email"
  | "radio";

const Input = forwardRef(
  (
    {
      variant = "default",
      formHook,
      clearable,
      className,
      iconButtonProps,
      hideErrorMessage,
      customVariant,
      labelClassName,
      descriptionClassName,
      labelVariant,
      readOnly,
      format,
      ...inputWrapperProps
    }: InputProps,
    ref?: Ref<HTMLInputElement>
  ) => {
    const {
      label,
      description,
      descriptionFooter,
      containerClassName,
      error,
      required,
      feedbackRequired,
      ...inputProps
    } = inputWrapperProps;
    const id = useId();
    const customVariantClasses = customVariant ? customVariant : {};
    const variantClasses = {
      default: {
        "px-3 py-[9px] rounded-lg focus:border-primary-500": true,
        "border border-neutral-200": !error,
        "bg-neutral-150": readOnly
      },
      secondary: {
        "border-0 border-b py-[10px] px-0": true,
        "pl-4": inputProps.type === "number",
        "border-b-neutral-400": !error
      },
      login: {
        "border-0 h-full relative z-[1] bg-transparent border-b-2 hover:border-blue-300 focus:border-blue-300 border-grey-400 hover:shadow-inset-blue focus:shadow-inset-blue w-full input-login pb-3.5 outline-none":
          true,
        "pl-4": inputProps.type === "number",
        "border-b-neutral-300": !error,
        "hover:shadow-inset-red": error,
        "focus:shadow-inset-red": error,
        "hover:border-red-300": error,
        "focus:border-red-300": error
      },
      signup: {
        "p-3 border border-grey-400 rounded-xl w-full hover:border-blue-300 hover:shadow-blue-border text-dark-700 opacity-60 outline-none":
          true,
        "pl-4": inputProps.type === "number",
        "border-neutral-300": !error
      }
    };

    const inputClasses = cn(
      className,
      "w-full outline-none transition-all duration-300 ease-in-out focus:ring-transparent",
      { ...variantClasses[variant] },
      { ["border border-error focus:border-error"]: error },
      customVariantClasses
    );

    const clearInput = () => formHook?.setValue(inputWrapperProps.name, "");
    const registeredFormProps = formHook?.register(inputWrapperProps.name, {
      //transform empty string to null
      setValueAs: value =>
        (inputProps.type === "number" && typeof value === "string" && !value) || typeof value === "undefined"
          ? null
          : value
    });

    //To stop number input value changes on scroll
    useEventListener(id, "wheel", function () {
      //@ts-ignore
      document.activeElement?.blur();
    });

    if (!!clearable && !!formHook?.getValues(inputWrapperProps.name)) {
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

    const formatNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target as HTMLInputElement;
      const value = input.value.replace(/[^\d.]/g, "");

      // Split the value into integer and decimal parts
      const [integerPart, decimalPart] = value.split(".");

      // Format the integer part with commas every three digits
      const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      // Combine the formatted integer part with the decimal part
      let formattedValue = formattedIntegerPart;
      if (decimalPart !== undefined) {
        formattedValue += "." + decimalPart.slice(0, 2); // Limit decimal part to two digits
      }

      // Update the input value with the formatted number
      console.log(formattedValue);

      input.value = formattedValue;
    };

    return (
      <InputWrapper
        inputId={id}
        label={label}
        labelVariant={labelVariant}
        description={description}
        descriptionFooter={descriptionFooter}
        containerClassName={containerClassName}
        error={!hideErrorMessage ? error : undefined}
        required={required}
        feedbackRequired={feedbackRequired}
        labelClassName={labelClassName}
        descriptionClassName={descriptionClassName}
      >
        <div className="relative">
          <input
            {...inputProps}
            {...registeredFormProps}
            onKeyDown={inputProps.type === "number" ? preventScientificNumbers : undefined}
            onChange={format === "number" ? formatNumber : undefined}
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
