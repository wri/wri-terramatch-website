import cn from "classnames";
import classNames from "classnames";
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
  variant?: "secondary" | "default" | "login" | "signup" | "monitored" | "treePlanted";
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
  suffixLabelView?: boolean;
  classNameContainerInput?: string;
  classNameError?: string;
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
      customVariant = {},
      labelClassName,
      descriptionClassName,
      labelVariant,
      readOnly,
      format,
      suffixLabelView,
      classNameContainerInput,
      classNameError,
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
    const customVariantClasses = customVariant ?? {};
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
        "border-0 p-0 h-full relative z-[1] bg-transparent border-b-2 hover:border-primary border-darkCustom-100 hover:shadow-inset-blue w-full input-login pb-3.5 outline-none text-14-light !font-primary":
          true,
        "pl-4": inputProps.type === "number",
        "border-b-neutral-300": !error,
        "hover:shadow-inset-red": error,
        "focus:shadow-inset-red": error,
        "hover:border-red-300": error,
        "focus:border-red-300": error
      },
      signup: {
        "p-3 border border-darkCustom-100 rounded-xl w-full hover:border-primary hover:shadow-blue-border text-dark-700 opacity-60 outline-none text-14-light !font-primary":
          true,
        "pl-4": inputProps.type === "number",
        "border-neutral-300": !error
      },
      monitored: {
        "px-3 py-1.5 border border-darkCustom-100 rounded-xl w-full hover:border-primary hover:shadow-blue-border text-dark-700 opacity-60 outline-none text-14-light !font-primary":
          true,
        "pl-4": inputProps.type === "number",
        "border-neutral-300": !error
      },
      treePlanted: {
        "py-[7.5px] py-1.5 !w-[100px] text-center border border-blueCustom-700 rounded hover:border-primary hover:shadow-blue-border opacity-60 outline-none text-14-light !font-primary":
          true,
        "text-center": inputProps.type === "number"
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
      setValueAs: value =>
        (inputProps.type === "number" && typeof value === "string" && !value) || typeof value === "undefined"
          ? null
          : value
    });

    useEventListener(id, "wheel", function () {
      //@ts-ignore
      document.activeElement?.blur();
    });

    if (!!clearable && !!formHook?.getValues(inputWrapperProps.name)) {
      iconButtonProps = {
        iconProps: {
          name: IconNames.X_CIRCLE,
          className: "fill-primary-500"
        },
        onClick: () => clearInput()
      };
    }

    const preventScientificNumbers = (e: KeyboardEvent<HTMLInputElement>) => {
      const disallowed = ["e", "E", "+"];
      const min = inputProps.min;
      const shouldBlockMinus = !min || Number(min) >= 0;

      if (shouldBlockMinus) disallowed.push("-");

      disallowed.includes(e.key) && e.preventDefault();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (inputProps.type === "number" && format === "number") {
        const value = e.target.value;
        const formattedValue = value.replace(/^0+(?=\d)/, "");
        e.target.value = formattedValue;
      }

      if (inputProps.onChange) {
        inputProps.onChange(e);
      } else {
        formHook?.setValue(inputWrapperProps.name, e.target.value);
      }
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
        suffixLabelView={suffixLabelView}
        classNameError={classNameError}
      >
        <div className={classNames("relative", classNameContainerInput)}>
          <input
            {...inputProps}
            {...registeredFormProps}
            {...(inputProps.onChange ? { onChange: handleChange } : {})}
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
