import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { PropsWithChildren } from "react";
import { FieldValues, useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { StrategyAreaInput, StrategyAreaInputProps } from "../StrategyAreaInput/StrategyAreaInput";

export interface RHFStrategyAreaDataTableProps
  extends Omit<StrategyAreaInputProps, "defaultValue" | "value" | "onChange" | "optionsFilter">,
    UseControllerProps {
  onChangeCapture?: () => void;
  optionsFilterFieldName?: string;
  formHook: UseFormReturn<FieldValues, any>;
  collection?: string;
}

/**
 * @param props PropsWithChildren<RHFSelectProps>
 * @returns
 */

export const getStrategyAreaColumns = (t: typeof useT | Function = (t: string) => t): AccessorKeyColumnDef<any>[] => [
  {
    accessorKey: "strategy",
    header: t("Restoration strategy or land use")
  },
  {
    accessorKey: "percentage",
    header: t("% of project area"),
    cell: props => `${props.getValue()}%`
  }
];

const RHFStrategyAreaDataTable = ({
  onChangeCapture,
  optionsFilterFieldName,
  formHook,
  collection,
  ...props
}: PropsWithChildren<RHFStrategyAreaDataTableProps>) => {
  const {
    field: { value, onChange }
  } = useController(props);
  const _onChange = (value: string) => {
    onChange(value);
    onChangeCapture?.();
  };

  return (
    <StrategyAreaInput
      onChange={_onChange}
      {...props}
      optionsFilter={optionsFilterFieldName ? formHook?.watch(optionsFilterFieldName, null) : undefined}
      formHook={formHook}
      collection={collection}
      value={value}
    />
  );
};

export default RHFStrategyAreaDataTable;
