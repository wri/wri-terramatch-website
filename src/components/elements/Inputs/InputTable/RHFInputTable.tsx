import { PropsWithChildren, useMemo } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import InputTable, { InputTableProps } from "./InputTable";

// TODO:
//  * Accept headers from the API response, use useMemo to get the labels, and sort on order
//  * Accept question ID in order to pull children with a hook
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

  const _onChange = async (value: any) => {
    onChange(value);
    const isValid = await formHook?.trigger(props.name);

    if (isValid) onChangeCapture?.();
  };

  const rowsValues: { [index: string]: any } = formHook?.watch(props.name);

  const total = useMemo(() => {
    if (!props.hasTotal || !rowsValues) return 0;

    return Object.values(rowsValues).reduce((total, value) => {
      if (typeof value === "number") return total + value;
      else return total;
    }, 0);
  }, [rowsValues, props.hasTotal]);

  return (
    <InputTable
      {...props}
      value={value}
      onChange={_onChange}
      total={total}
      errors={formHook?.formState.errors[props.name]}
    />
  );
};

export default RHFInputTable;
