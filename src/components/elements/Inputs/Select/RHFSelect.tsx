import { PropsWithChildren, useMemo } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { toFormOptions, useFilterFieldName } from "@/components/extensive/WizardForm/utils";
import { FormQuestionOptionDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { Option, OptionValue } from "@/types/common";

import Select, { SelectProps } from "./Select";

export interface RHFSelectProps
  extends Omit<SelectProps, "defaultValue" | "value" | "onChange" | "optionsFilter" | "options">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook: UseFormReturn;
  options: FormQuestionOptionDto[] | Option[];
  linkedFieldKey?: string;
}

const RHFSelect = ({
  onChangeCapture,
  formHook,
  options,
  linkedFieldKey,
  ...props
}: PropsWithChildren<RHFSelectProps>) => {
  const {
    field: { value, onChange }
  } = useController(props);

  const propsOptions = useMemo(() => toFormOptions(options), [options]);
  const filterFieldName = useFilterFieldName(linkedFieldKey);

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
      optionsFilter={filterFieldName == null ? undefined : formHook.watch(filterFieldName, null)}
      options={propsOptions}
    />
  );
};

export default RHFSelect;
