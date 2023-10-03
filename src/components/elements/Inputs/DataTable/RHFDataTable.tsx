import { PropsWithChildren } from "react";
import { useController, UseControllerProps } from "react-hook-form";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFDataTableProps extends Omit<DataTableProps<any>, "value" | "onChange">, UseControllerProps {
  onChangeCapture?: () => void;
}

/**
 * @param props PropsWithChildren<RHFSelectProps>
 * @returns React Hook Form Ready Select Component
 */
const RHFDataTable = ({ onChangeCapture, ...props }: PropsWithChildren<RHFDataTableProps>) => {
  const {
    field: { value, onChange }
  } = useController(props);

  const _onChange = (value: any[]) => {
    onChange(value);
    onChangeCapture?.();
  };

  return <DataTable {...props} value={value || []} onChange={_onChange} />;
};

export default RHFDataTable;
