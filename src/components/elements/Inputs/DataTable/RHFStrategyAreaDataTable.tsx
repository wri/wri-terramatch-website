import { PropsWithChildren, useMemo } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { toFormOptions, useFilterFieldName } from "@/components/extensive/WizardForm/utils";
import { FormQuestionOptionDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { Option } from "@/types/common";

import { StrategyAreaInput, StrategyAreaInputProps } from "../StrategyAreaInput/StrategyAreaInput";

export interface RHFStrategyAreaDataTableProps
  extends Omit<StrategyAreaInputProps, "defaultValue" | "value" | "onChange" | "optionsFilter" | "options">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook: UseFormReturn;
  collection?: string;
  options: FormQuestionOptionDto[] | Option[];
  linkedFieldKey?: string;
}

const RHFStrategyAreaDataTable = ({
  onChangeCapture,
  linkedFieldKey,
  options,
  formHook,
  collection,
  ...props
}: PropsWithChildren<RHFStrategyAreaDataTableProps>) => {
  const {
    field: { value, onChange }
  } = useController(props);

  const propsOptions = useMemo(() => toFormOptions(options), [options]);
  const filterFieldName = useFilterFieldName(linkedFieldKey);

  const _onChange = (value: string) => {
    onChange(value);
    onChangeCapture?.();
  };

  return (
    <StrategyAreaInput
      onChange={_onChange}
      {...props}
      optionsFilter={filterFieldName == null ? undefined : formHook?.watch(filterFieldName, null)}
      formHook={formHook}
      collection={collection}
      value={value}
      options={propsOptions}
    />
  );
};

export default RHFStrategyAreaDataTable;
