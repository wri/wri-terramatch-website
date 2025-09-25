import { useT } from "@transifex/react";
import { useEffect, useMemo, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { InputProps } from "@/components/elements/Inputs/Input/Input";
import RadioGroup from "@/components/elements/Inputs/RadioGroup/RadioGroup";
import List from "@/components/extensive/List/List";
import FormField from "@/components/extensive/WizardForm/FormField";
import { questionDtoToDefinition } from "@/components/extensive/WizardForm/utils";
import { selectChildQuestions } from "@/connections/util/Form";
import { useValueChanged } from "@/hooks/useValueChanged";
import { OptionValueWithBoolean } from "@/types/common";

export interface ConditionalInputProps extends Omit<InputProps, "defaultValue" | "type">, UseControllerProps {
  fieldId: string;
  formHook: UseFormReturn;
  onChangeCapture: () => void;
}

const ConditionalInput = (props: ConditionalInputProps) => {
  const { fieldId, formHook, onChangeCapture, ...inputProps } = props;
  const [valueCondition, setValueCondition] = useState<OptionValueWithBoolean>();
  const t = useT();
  const { field } = useController(props);

  const value = formHook.watch(fieldId);

  const children = useMemo(() => selectChildQuestions(fieldId), [fieldId]);
  const displayChildren = useMemo(
    () => children.filter(({ showOnParentCondition }) => showOnParentCondition === value).map(questionDtoToDefinition),
    [children, value]
  );

  useEffect(() => {
    children.forEach(child => {
      if (child.showOnParentCondition === value) formHook.register(child.uuid);
    });
    formHook.clearErrors(fieldId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, fieldId, value]);

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
      formHook.reset(formHook.getValues());
      return;
    }
    const values = props?.formHook?.formState?.defaultValues;
    let fieldsCount = 0;
    children.forEach(child => {
      if (values && Array.isArray(values[child.uuid]) && values[child.uuid]?.length > 0 && field.value == null) {
        field.onChange(true);
        formHook.reset(formHook.getValues());
        return;
      }
      if (values && (field.value == true || field.value == null)) {
        if ((Array.isArray(values[child.uuid]) && values[child.uuid]?.length < 1) || values[child.uuid] == null) {
          fieldsCount++;
        }
      }
    });

    if (fieldsCount == children.length) {
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
        items={displayChildren}
        uniqueId="name"
        itemClassName="mt-8"
        render={child => <FormField key={child.name} field={child} formHook={formHook} onChange={onChangeCapture} />}
      />
    </>
  );
};

export default ConditionalInput;
