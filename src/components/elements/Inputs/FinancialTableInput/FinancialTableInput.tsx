import { useT } from "@transifex/react";
import { FC, useId } from "react";
import { Control, UseFormReturn } from "react-hook-form";

import Table from "@/components/elements/Table/Table";

import InputWrapper, { InputWrapperProps } from "../InputElements/InputWrapper";

export interface FinancialTableInputProps extends Omit<InputWrapperProps, "error"> {
  label?: string;
  description?: string;
  containerClassName?: string;
  required?: boolean;
  feedbackRequired?: boolean;
  tableColumns: any[];
  value: any[];
  onChange?: (values: any) => void;
  generateUuids?: boolean;
  additionalValues?: any;
  formHook?: UseFormReturn;
  control?: Control;
  onChangeCapture?: (values: any) => void;
  resetTable?: number;
}

const FinancialTableInput: FC<FinancialTableInputProps> = ({ resetTable, tableColumns, value, ...props }) => {
  const id = useId();
  const t = useT();

  return (
    <InputWrapper inputId={id} {...props} label={props.label ?? t("ADD FINANCIAL DATA")}>
      <Table key={resetTable} columns={tableColumns} data={value} />
    </InputWrapper>
  );
};

export default FinancialTableInput;
