import cn from "classnames";
import classNames from "classnames";
import {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  KeyboardEvent,
  Ref,
  useCallback,
  useEffect,
  useId,
  useMemo
} from "react";
import { UseFormReturn } from "react-hook-form";
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
  iconButtonPropsLeft?: IconButtonProps;
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

const IS_ISO_MIDNIGHT = /^\d{4}-\d{2}-\d{2}T00:00:00\.000000Z$/;
const formatDateValue = (type: HtmlInputType, value: string) => {
  if (!IS_ISO_MIDNIGHT.test(value)) return value;
  return (type === "date" ? value : new Date(value).toISOString()).split("T")[0];
};

const Input = forwardRef(
  (
    {
      variant = "default",
      formHook,
      clearable,
      className,
      iconButtonProps,
      iconButtonPropsLeft,
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
      label,
      description,
      descriptionFooter,
      containerClassName,
      error,
      required,
      feedbackRequired,
      ...inputProps
    }: InputProps,
    ref?: Ref<HTMLInputElement>
  ) => {
    const id = useId();
    const customVariantClasses = customVariant ?? {};
    const { type, onChange, name } = inputProps;
    const variantClasses = {
      default: {
        "px-3 py-[9px] rounded-lg focus:border-primary-500": true,
        "border border-neutral-200": !error,
        "bg-neutral-150": readOnly
      },
      secondary: {
        "border-0 border-b py-[10px] px-0": true,
        "pl-4": type === "number",
        "border-b-neutral-400": !error
      },
      login: {
        "border-0 p-0 h-full relative z-[1] bg-transparent border-b-2 hover:border-primary border-darkCustom-100 hover:shadow-inset-blue w-full input-login pb-3.5 outline-none text-14-light !font-primary":
          true,
        "pl-4": type === "number",
        "border-b-neutral-300": !error,
        "hover:shadow-inset-red": error,
        "focus:shadow-inset-red": error,
        "hover:border-red-300": error,
        "focus:border-red-300": error
      },
      signup: {
        "p-3 border border-darkCustom-100 rounded-xl w-full hover:border-primary hover:shadow-blue-border text-dark-700 opacity-60 outline-none text-14-light !font-primary":
          true,
        "pl-4": type === "number",
        "border-neutral-300": !error
      },
      monitored: {
        "px-3 py-1.5 border border-darkCustom-100 rounded-xl w-full hover:border-primary hover:shadow-blue-border text-dark-700 opacity-60 outline-none text-14-light !font-primary":
          true,
        "pl-4": type === "number",
        "border-neutral-300": !error
      },
      treePlanted: {
        "py-[7.5px] py-1.5 !w-[100px] text-center border border-blueCustom-700 rounded hover:border-primary hover:shadow-blue-border opacity-60 outline-none text-14-light !font-primary":
          true,
        "text-center": type === "number"
      }
    };

    const inputClasses = cn(
      className,
      "w-full outline-none transition-all duration-300 ease-in-out focus:ring-transparent",
      { ...variantClasses[variant] },
      { ["border border-error focus:border-error"]: error },
      customVariantClasses
    );

    // Check if input is date-like
    const isDateLike = type === "date" || type === "datetime-local";

    const registeredFormProps = formHook?.register(name, {
      setValueAs: value => {
        if ((type === "number" && value === "") || typeof value === "undefined") return null;
        if (isDateLike && typeof value === "string") return formatDateValue(type, value);
        return value;
      }
    });

    useEventListener(id, "wheel", function () {
      //@ts-ignore
      document.activeElement?.blur();
    });

    const clearableIconProps = useMemo(
      () => ({
        name: IconNames.X_CIRCLE,
        className: "fill-primary-500"
      }),
      []
    );
    const clearInput = useCallback(() => formHook?.setValue(name, ""), [formHook, name]);
    if (clearable && formHook?.getValues(name) != null) {
      iconButtonProps = {
        iconProps: clearableIconProps,
        onClick: clearInput
      };
    }

    const preventScientificNumbers = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        const disallowed = ["e", "E", "+"];
        const min = inputProps.min;
        const shouldBlockMinus = !allowNegative && (!min || Number(min) >= 0);

        if (shouldBlockMinus) disallowed.push("-");

        disallowed.includes(e.key) && e.preventDefault();
      },
      [allowNegative, inputProps.min]
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const isNumber = type === "number" && format === "number";
        if (isNumber && e.target.value != null) e.target.value = e.target.value.replace(/^0+(?=\d)/, "");
        if (isDateLike && e.target.value != null) e.target.value = formatDateValue(type, e.target.value);
        onChange != null ? onChange(e) : formHook?.setValue(name, e.target.value);
      },
      [type, format, isDateLike, onChange, formHook, name]
    );

    // Get the current form value and normalize it for date inputs
    const formValue = formHook?.getValues(name);

    // Normalize incoming value/defaultValue for date-like inputs on initial render
    const normalize = (v: unknown) => (isDateLike && typeof v === "string" ? formatDateValue(type, v) : v) as any;
    // This can skip useMemo because the values set are simple and this object gets spread across the props of <input>
    const valueProps: Record<string, any> = {};
    if ("value" in inputProps) {
      valueProps.value = normalize(inputProps.value);
    } else if ("defaultValue" in inputProps) {
      valueProps.defaultValue = normalize(inputProps.defaultValue);
    }

    // Update form with normalized value if needed
    useEffect(() => {
      const normalizedFormValue =
        isDateLike && typeof formValue === "string" ? formatDateValue(type, formValue) : formValue;
      if (isDateLike && formValue != null && formValue !== normalizedFormValue) {
        formHook?.setValue(name, normalizedFormValue, { shouldValidate: false, shouldDirty: false });
      }
    }, [formHook, formValue, isDateLike, name, type]);

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
          {iconButtonPropsLeft == null ? null : (
            <IconButton
              {...iconButtonPropsLeft!}
              className="pointer-events-none absolute left-3 top-[50%] translate-y-[-50%]"
            />
          )}
          <input
            {...inputProps}
            {...registeredFormProps}
            onChange={handleChange}
            onKeyDown={type === "number" ? preventScientificNumbers : undefined}
            ref={registeredFormProps?.ref ?? ref}
            id={id}
            className={inputClasses}
            aria-invalid={!!error}
            aria-errormessage={error?.message}
            aria-describedby={`${id}-description`}
            {...valueProps}
          />
          {iconButtonProps == null ? null : (
            <IconButton {...iconButtonProps!} className="absolute right-3 top-[50%] translate-y-[-50%]" />
          )}
        </div>
      </InputWrapper>
    );
  }
);

export default Input;
