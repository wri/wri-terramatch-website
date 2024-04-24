import classNames from "classnames";
import { useId } from "react";
import { FieldError, UseFormReturn } from "react-hook-form";
import { Else, If, Then, When } from "react-if";
import { twMerge } from "tailwind-merge";

import Text from "@/components/elements/Text/Text";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "form"> {
  name: string;
  label?: string | React.ReactNode;
  form?: UseFormReturn<any>;
  error?: FieldError;
  className?: string;
  textClassName?: string;
  inputClassName?: string;
}

const Checkbox = ({
  label,
  required,
  error,
  className,
  disabled,
  defaultChecked,
  textClassName,
  form,
  inputClassName,
  ...props
}: CheckboxProps) => {
  const id = useId();

  const labelIsComponent = label && typeof label !== "string";

  return (
    <div
      className={classNames(className, `relative flex items-start gap-4`, {
        "justify-between": !className?.includes("justify")
      })}
    >
      {label && (
        <label htmlFor={id} className="w-full">
          <If condition={labelIsComponent}>
            <Then>{label}</Then>
            <Else>
              <Text
                as="label"
                htmlFor={id}
                variant="text-body-600"
                className={`max-w-[365px] ${textClassName}`}
                containHtml
              >{`${label} ${required ? "*" : ""}`}</Text>
            </Else>
          </If>
        </label>
      )}

      <input
        {...props}
        {...form?.register(props.name)}
        id={id}
        defaultChecked={defaultChecked}
        required={required}
        disabled={disabled}
        type="checkbox"
        className={twMerge(
          classNames(
            "h-4 w-4 cursor-pointer rounded-sm border-neutral-400 transition-all duration-300 checked:text-primary-500 focus:ring-transparent disabled:bg-neutral-400 lg:h-5 lg:w-5",
            { "absolute opacity-0": labelIsComponent }
          ),
          inputClassName
        )}
      />
      <When condition={!!error}>
        <Text variant="text-body-500" className="absolute right-0 -bottom-6 w-full text-right text-error">
          {error?.message ?? ""}
        </Text>
      </When>
    </div>
  );
};

export default Checkbox;
