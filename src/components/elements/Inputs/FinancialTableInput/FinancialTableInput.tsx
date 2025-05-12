import { AccessorKeyColumnDef, RowData } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { useId } from "react";
import { Control, FieldValues, UseFormReturn } from "react-hook-form";

import Table from "@/components/elements/Table/Table";
import { FormField } from "@/components/extensive/WizardForm/types";

import InputWrapper, { InputWrapperProps } from "../InputElements/InputWrapper";

export interface FinancialTableInputProps<TData extends RowData & { uuid: string }>
  extends Omit<InputWrapperProps, "error"> {
  label?: string;
  description?: string;
  containerClassName?: string;
  required?: boolean;
  feedbackRequired?: boolean;
  tableColumns: AccessorKeyColumnDef<TData>[];
  value: any[];
  onChange?: (values: any) => void;
  generateUuids?: boolean;
  additionalValues?: any;
  formHook?: UseFormReturn<FieldValues, any>;
  control?: Control<FieldValues, any>;
  onChangeCapture?: (values: any) => void;
  handleCreate?: (value: any) => void;
  handleDelete?: (uuid?: string) => void;
  fields: FormField[];
}

const FinancialTableInput = (props: FinancialTableInputProps<any>) => {
  const id = useId();
  const t = useT();
  return (
    <InputWrapper
      inputId={id}
      label={props.label ?? t("ADD FINANCIAL DATA")}
      containerClassName={props.containerClassName}
      description={props.description}
      required={props.required}
      feedbackRequired={props.feedbackRequired}
    >
      <Table columns={props.tableColumns} data={props.value} {...props} />
    </InputWrapper>
  );
};

export default FinancialTableInput;
