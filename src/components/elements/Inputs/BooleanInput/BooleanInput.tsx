import { useT } from "@transifex/react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { InputProps } from "@/components/elements/Inputs/Input/Input";
import RadioGroup from "@/components/elements/Inputs/RadioGroup/RadioGroup";

export interface BooleanInputProps extends Omit<InputProps, "defaultValue" | "type">, UseControllerProps {
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
        { title: t("Yes"), value: "yes" },
        { title: t("No"), value: "no" }
      ]}
      value={field.value === true ? "yes" : field.value === false ? "no" : undefined}
      onChange={value => {
        field.onChange(value === "yes");
        onChangeCapture();
      }}
    />
  );
};

export default BooleanInput;
