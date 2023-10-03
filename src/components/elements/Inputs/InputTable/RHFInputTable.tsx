import { PropsWithChildren } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import InputTable, { InputTableProps } from "./InputTable";

export interface RHFInputTableProps extends Omit<InputTableProps, "value" | "onChange" | "errors">, UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
}

/**
 * @param props PropsWithChildren<RHFTreeSpeciesInputProps>
 * @returns React Hook Form Ready TreeSpeciesInput Component
 */
const RHFInputTable = ({ onChangeCapture, formHook, ...props }: PropsWithChildren<RHFInputTableProps>) => {
  const {
    field: { value, onChange }
  } = useController(props);

  const _onChange = (value: any) => {
    onChange(value);

    onChangeCapture?.();
  };

  return <InputTable {...props} value={value} onChange={_onChange} errors={formHook?.formState.errors[props.name]} />;
};

export default RHFInputTable;
