import { useT } from "@transifex/react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { InputProps } from "@/components/elements/Inputs/Input/Input";
import RadioGroup from "@/components/elements/Inputs/RadioGroup/RadioGroup";
import { FormField } from "@/components/extensive/WizardForm/types";

export interface BooleanInputProps extends Omit<InputProps, "defaultValue">, UseControllerProps {
  fields: FormField[];
  formHook: UseFormReturn;
  onChangeCapture: () => void;
}

const BooleanInput = (props: BooleanInputProps) => {
  const { onChangeCapture, ...inputProps } = props;
  const t = useT();
  const { field } = useController(props);

  return (
    <RadioGroup
      {...inputProps}
      options={[
        { title: t("Yes"), value: true },
        { title: t("No"), value: false }
      ]}
      value={field.value}
      onChange={value => {
        field.onChange(value);
        onChangeCapture();
      }}
    />
  );
};

export default BooleanInput;
