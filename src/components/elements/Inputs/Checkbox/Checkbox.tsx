import classNames from "classnames";
import { useId } from "react";
import { FieldError, UseFormReturn } from "react-hook-form";
import { Else, If, Then, When } from "react-if";

import Text from "@/components/elements/Text/Text";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "form"> {
  name: string;
  label: string | React.ReactNode;
  form?: UseFormReturn<any>;
  error?: FieldError;
  className?: string;
  textClassName?: string;
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
  ...props
}: CheckboxProps) => {
  const id = useId();

  const labelIsComponent = typeof label !== "string";

  return (
    <div
      className={classNames(className, `relative flex items-start gap-4`, {
        "justify-between": !className?.includes("justify")
      })}
    >
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

      <input
        id={id}
        defaultChecked={defaultChecked}
        required={required}
        disabled={disabled}
        type="checkbox"
        className={classNames(
          "h-5 w-5 cursor-pointer rounded-sm border-neutral-400 transition-all duration-300 checked:text-primary-500 focus:ring-transparent disabled:bg-neutral-400",
          { "absolute opacity-0": labelIsComponent }
        )}
        {...form?.register(props.name)}
        {...props}
      />
      <When condition={!!error}>
        <Text variant="text-body-500" className="absolute -bottom-6 right-0 w-full text-right text-error">
          {error?.message ?? ""}
        </Text>
      </When>
    </div>
  );
};

export default Checkbox;
