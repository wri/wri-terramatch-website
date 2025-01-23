import { useT } from "@transifex/react";
import { useEffect } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { InputProps } from "@/components/elements/Inputs/Input/Input";
import RadioGroup from "@/components/elements/Inputs/RadioGroup/RadioGroup";
import List from "@/components/extensive/List/List";
import { FieldMapper } from "@/components/extensive/WizardForm/FieldMapper";
import { FormField } from "@/components/extensive/WizardForm/types";
import { OptionValueWithBoolean } from "@/types/common";

export interface ConditionalInputProps extends Omit<InputProps, "defaultValue">, UseControllerProps {
  fields: FormField[];
  formHook: UseFormReturn;
  onChangeCapture: () => void;
}

const ConditionalInput = (props: ConditionalInputProps) => {
  const { fields, formHook, onChangeCapture, ...inputProps } = props;
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
    field.onChange(value);
    onChangeCapture();
    formHook.trigger();
  };

  useEffect(() => {
    onChangeCapture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, formHook]);

  useEffect(() => {
    const values = props?.formHook?.formState?.defaultValues;
    let hasChildrenValues = false;
    fields.forEach(fieldChildren => {
      if (values && values[fieldChildren.name] && fieldChildren.is_parent_conditional_default) {
        hasChildrenValues = true;
      }
    });
    if (field.value == null) {
      field.onChange(false);
    }
    if (hasChildrenValues) {
      field.onChange(true);
    }
  }, [field, field.value]);

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
