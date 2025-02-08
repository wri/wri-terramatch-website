import { useT } from "@transifex/react";
import { useEffect, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { InputProps } from "@/components/elements/Inputs/Input/Input";
import RadioGroup from "@/components/elements/Inputs/RadioGroup/RadioGroup";
import List from "@/components/extensive/List/List";
import { FieldMapper } from "@/components/extensive/WizardForm/FieldMapper";
import { FormField } from "@/components/extensive/WizardForm/types";
import { useValueChanged } from "@/hooks/useValueChanged";
import { OptionValueWithBoolean } from "@/types/common";

export interface ConditionalInputProps extends Omit<InputProps, "defaultValue">, UseControllerProps {
  fields: FormField[];
  formHook: UseFormReturn;
  onChangeCapture: () => void;
}

const ConditionalInput = (props: ConditionalInputProps) => {
  const { fields, formHook, onChangeCapture, ...inputProps } = props;
  const [valueCondition, setValueCondition] = useState<OptionValueWithBoolean>();
  const t = useT();
  const { field } = useController(props);

  useEffect(() => {
    fields.forEach(field => {
      if (field.condition == formHook.watch(props.name)) formHook.register(field.name);
    });
    formHook.clearErrors(props.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, formHook.watch(props.name)]);

  const onChange = (value: OptionValueWithBoolean) => {
    setValueCondition(value);
    field.onChange(value);
    onChangeCapture();
    formHook.trigger();
  };

  useEffect(() => {
    onChangeCapture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, formHook]);

  useValueChanged(valueCondition, () => {
    if (valueCondition == true) {
      field.onChange(true);
      return;
    }
    const values = props?.formHook?.formState?.defaultValues;
    let fieldsCount = 0;
    fields.forEach(fieldChildren => {
      if (
        values &&
        Array.isArray(values[fieldChildren.name]) &&
        values[fieldChildren.name]?.length > 0 &&
        field.value == null
      ) {
        field.onChange(true);
        return;
      }
      if (values && (field.value == true || field.value == null)) {
        if (
          (Array.isArray(values[fieldChildren.name]) && values[fieldChildren.name]?.length < 1) ||
          values[fieldChildren.name] == null
        ) {
          fieldsCount++;
        }
      }
    });

    if (fieldsCount == fields?.length) {
      field.onChange(false);
    }
  });

  return (
    <>
      <RadioGroup
        {...inputProps}
        options={[
          { title: t("Yes"), value: true },
          { title: t("No"), value: false }
        ]}
        value={field.value}
        onChange={onChange}
      />

      <List
        items={fields.filter(field => field.condition === formHook.watch(props.name))}
        uniqueId="name"
        itemClassName="mt-8"
        render={field => <FieldMapper field={field} formHook={formHook} onChange={onChangeCapture} />}
      />
    </>
  );
};

export default ConditionalInput;
