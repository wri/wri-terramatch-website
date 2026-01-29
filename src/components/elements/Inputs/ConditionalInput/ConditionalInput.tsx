import { useT } from "@transifex/react";
import { useEffect, useMemo } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { InputProps } from "@/components/elements/Inputs/Input/Input";
import RadioGroup from "@/components/elements/Inputs/RadioGroup/RadioGroup";
import List from "@/components/extensive/List/List";
import FormField from "@/components/extensive/WizardForm/FormField";
import { useFieldsProvider } from "@/context/wizardForm.provider";
import { OptionValueWithBoolean } from "@/types/common";
import { isNotNull } from "@/utils/array";

export interface ConditionalInputProps extends Omit<InputProps, "defaultValue" | "type">, UseControllerProps {
  fieldId: string;
  formHook: UseFormReturn;
  onChangeCapture: () => void;
}

const ConditionalInput = (props: ConditionalInputProps) => {
  const { fieldId, formHook, onChangeCapture, ...inputProps } = props;
  const t = useT();
  const { field } = useController(props);
  const { childNames, fieldByName } = useFieldsProvider();

  const value = formHook.watch(fieldId);

  const children = useMemo(
    () => childNames(fieldId).map(fieldByName).filter(isNotNull),
    [childNames, fieldByName, fieldId]
  );
  const displayChildIds = useMemo(
    () => children.filter(({ showOnParentCondition }) => showOnParentCondition === value).map(({ name }) => name),
    [children, value]
  );

  useEffect(() => {
    children.forEach(child => {
      if (child.showOnParentCondition === value) formHook.register(child.name);
    });
    formHook.clearErrors(fieldId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, fieldId, value]);

  const onChange = (value: OptionValueWithBoolean) => {
    field.onChange(value);
    onChangeCapture();
    formHook.trigger();
  };

  useEffect(() => {
    onChangeCapture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, formHook]);

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
        items={displayChildIds}
        uniqueId="name"
        itemClassName="mt-8"
        render={childId => <FormField key={childId} fieldId={childId} formHook={formHook} onChange={onChangeCapture} />}
      />
    </>
  );
};

export default ConditionalInput;
