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
    // const unregisterFields = () => {
    //   const conditionValue = formHook.watch(props.name);
    //   if (conditionValue !== false) {
    //     fields
    //       .filter(field => field.condition !== conditionValue)
    //       .forEach(field => {
    //         formHook.unregister(field.name);
    //       });
    //   }
    // };

    // unregisterFields();

    // return () => unregisterFields();
    fields
      .filter(field => field.condition !== formHook.watch(props.name))
      .forEach(field => {
        formHook.unregister(field.name);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, formHook, props.name, formHook.watch(props.name)]);
  const onChange = (value: OptionValueWithBoolean) => {
    field.onChange(value);
    onChangeCapture();
    formHook.trigger();
  };

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
