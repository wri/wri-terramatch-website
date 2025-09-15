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
  allowNegative?: boolean;
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
      allowNegative,
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
      setValueAs: value => {
        if ((inputProps.type === "number" && typeof value === "string" && !value) || typeof value === "undefined") {
          return null;
        }
        const isDateLike = inputProps.type === "date" || inputProps.type === "datetime-local";
        if (isDateLike && typeof value === "string") {
          return formatDateValue(value);
        }
        return value;
      }
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
      const shouldBlockMinus = !allowNegative && (!min || Number(min) >= 0);

      if (shouldBlockMinus) disallowed.push("-");

      disallowed.includes(e.key) && e.preventDefault();
    };

    const formatDateValue = (value: string) => {
      const strictIsoMidnight = /^\d{4}-\d{2}-\d{2}T00:00:00\.000000Z$/;
      if (!strictIsoMidnight.test(value)) return value;
      if (inputProps.type === "date") return value.split("T")[0];
      if (inputProps.type === "datetime-local") {
        const d = new Date(value);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const hh = String(d.getHours()).padStart(2, "0");
        const mi = String(d.getMinutes()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
      }
      return value;
    };

    // Check if input is date-like
    const isDateLike = inputProps.type === "date" || inputProps.type === "datetime-local";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const isNumber = inputProps.type === "number" && format === "number";
      if (isNumber) e.target.value = e.target.value.replace(/^0+(?=\d)/, "");
      if (isDateLike && e.target.value) e.target.value = formatDateValue(e.target.value);
      inputProps.onChange ? inputProps.onChange(e) : formHook?.setValue(inputWrapperProps.name, e.target.value);
    };

    // Normalize incoming value/defaultValue for date-like inputs on initial render
    const normalize = (v: unknown) => (isDateLike && typeof v === "string" ? formatDateValue(v) : v) as any;
    const valueProps: Record<string, any> = {};
    if ("value" in (inputProps as any)) valueProps.value = normalize((inputProps as any).value);
    else if ("defaultValue" in (inputProps as any))
      valueProps.defaultValue = normalize((inputProps as any).defaultValue);
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
            onChange={handleChange}
            onKeyDown={inputProps.type === "number" ? preventScientificNumbers : undefined}
            ref={registeredFormProps?.ref || ref}
            id={id}
            className={inputClasses}
            aria-invalid={!!error}
            aria-errormessage={error?.message}
            aria-describedby={`${id}-description`}
            {...valueProps}
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
