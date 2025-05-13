import { useT } from "@transifex/react";
import { useId } from "react";
import { Control, FieldValues, UseFormReturn } from "react-hook-form";

import Table from "@/components/elements/Table/Table";

// import { FormField } from "@/components/extensive/WizardForm/types";
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
  formHook?: UseFormReturn<FieldValues, any>;
  control?: Control<FieldValues, any>;
  onChangeCapture?: (values: any) => void;
  handleCreate?: (value: any) => void;
  handleDelete?: (uuid?: string) => void;
  resetTable?: any;
}

const FinancialTableInput = (props: FinancialTableInputProps) => {
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
      {...props}
    >
      <Table columns={props.tableColumns} data={props.value} {...props} key={props.resetTable} />
    </InputWrapper>
  );
};

export default FinancialTableInput;
