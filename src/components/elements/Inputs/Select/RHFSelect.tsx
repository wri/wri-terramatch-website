import { PropsWithChildren } from "react";
import { FieldValues, useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { OptionValue } from "@/types/common";

import Select, { SelectProps } from "./Select";

export interface RHFSelectProps
  extends Omit<SelectProps, "defaultValue" | "value" | "onChange" | "optionsFilter">,
    UseControllerProps {
  onChangeCapture?: () => void;
  optionsFilterFieldName?: string;
  formHook: UseFormReturn<FieldValues, any>;
}

/**
 * @param props PropsWithChildren<RHFSelectProps>
 * @returns React Hook Form Ready Select Component
 */
const RHFSelect = ({
  onChangeCapture,
  optionsFilterFieldName,
  formHook,
  ...props
}: PropsWithChildren<RHFSelectProps>) => {
  const {
    field: { value, onChange }
  } = useController(props);

  const _onChange = (value: OptionValue[]) => {
    if (props.multiSelect) onChange(value);
    else onChange(value?.[0]);

    onChangeCapture?.();
  };

  return (
    <Select
      {...props}
      value={value}
      onChange={_onChange}
      optionsFilter={optionsFilterFieldName ? formHook.watch(optionsFilterFieldName, null) : undefined}
    />
  );
};

export default RHFSelect;
