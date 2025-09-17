import { useT } from "@transifex/react";
import classNames from "classnames";
import { forwardRef, useId } from "react";
import { FieldError, UseFormReturn } from "react-hook-form";
import { Else, If, Then, When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import Text from "@/components/elements/Text/Text";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "form"> {
  name: string;
  label?: string | React.ReactNode;
  form?: UseFormReturn<any>;
  error?: FieldError;
  className?: string;
  textClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      required,
      error,
      className,
      disabled,
      defaultChecked,
      textClassName,
      form,
      inputClassName,
      errorClassName,
      ...props
    },
    ref
  ) => {
    const id = useId();

    const labelIsComponent = label && typeof label !== "string";
    const t = useT();

    return (
      <div
        className={
          (tw(
            classNames(`relative flex items-center gap-4`, {
              "justify-between": !className?.includes("justify")
            })
          ),
          className)
        }
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
                >
                  {t(`${label} ${required ? "*" : ""}`)}
                </Text>
              </Else>
            </If>
          </label>
        )}

        <input
          ref={ref}
          {...props}
          {...form?.register(props.name)}
          id={id}
          defaultChecked={defaultChecked}
          required={required}
          disabled={disabled}
          type="checkbox"
          onChange={e => {
            if (props.onChange) {
              props.onChange(e);
            } else if (props.onClick) {
              props.onClick(e as any);
            }
          }}
          className={tw(
            classNames(
              "h-4 w-4 cursor-pointer rounded-sm border-neutral-400 transition-all duration-300 checked:text-primary-500 focus:ring-transparent disabled:bg-neutral-400 lg:h-5 lg:w-5",
              { "absolute opacity-0": labelIsComponent }
            ),
            inputClassName
          )}
        />
        <When condition={!!error}>
          <Text
            variant="text-body-500"
            className={classNames("absolute right-0 -bottom-6 w-full text-right text-error", errorClassName)}
          >
            {t(error?.message ?? "")}
          </Text>
        </When>
      </div>
    );
  }
);

export default Checkbox;
