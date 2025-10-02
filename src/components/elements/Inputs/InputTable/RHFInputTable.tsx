import { FC, PropsWithChildren, useMemo } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { FieldDefinition } from "@/components/extensive/WizardForm/types";
import { useFieldsProvider } from "@/context/wizardForm.provider";
import { isNotNull } from "@/utils/array";

import InputTable, { InputTableProps, InputTableRow } from "./InputTable";

export type RHFInputTableProps = Omit<InputTableProps, "value" | "onChange" | "errors" | "headers" | "rows"> &
  UseControllerProps &
  PropsWithChildren<{
    onChangeCapture?: () => void;
    formHook?: UseFormReturn;
    headers: string[];
    fieldId: string;
  }>;

const toTableRow = (field?: FieldDefinition): InputTableRow | null => {
  if (field == null) return null;

  const row = {
    name: field.name,
    placeholder: field.placeholder ?? undefined,
    label: field.label,
    required: field.validation?.required === true,
    description: field.description ?? undefined
  };
  switch (field.inputType) {
    case "url":
    case "date":
    case "text":
      return { ...row, type: field.inputType };
    case "number":
      if (field.linkedFieldKey?.includes("-lat-")) {
        return { ...row, type: "number", min: -90, max: 90, allowNegative: true };
      }
      if (field.linkedFieldKey?.includes("-long-")) {
        return { ...row, type: "number", min: -180, max: 180, allowNegative: true };
      }
      return { ...row, type: "number", step: field.additionalProps?.step };
    case "number-percentage":
      return { ...row, type: "number", min: 0, max: 100 };
    default:
      return null;
  }
};

const RHFInputTable: FC<RHFInputTableProps> = ({ onChangeCapture, formHook, headers, fieldId, ...props }) => {
  const {
    field: { value, onChange }
  } = useController(props);
  const propsHeaders = useMemo(() => {
    const labels = headers.map(label => label);
    return [labels[0] ?? "", labels[1] ?? ""] as const;
  }, [headers]);
  const { childNames, fieldByName } = useFieldsProvider();
  const rows = useMemo(
    () => childNames(fieldId).map(fieldByName).map(toTableRow).filter(isNotNull),
    [childNames, fieldByName, fieldId]
  );

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
      headers={propsHeaders}
      rows={rows}
      value={value}
      onChange={_onChange}
      total={total}
      errors={formHook?.formState.errors[props.name]}
    />
  );
};

export default RHFInputTable;
