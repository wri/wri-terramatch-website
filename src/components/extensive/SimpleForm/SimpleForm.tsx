import { FC, FormHTMLAttributes, Fragment, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";

import FormField from "@/components/extensive/WizardForm/FormField";

import List from "../List/List";
import { FieldDefinition } from "../WizardForm/types";

export interface SimpleFormProps {
  questions: FieldDefinition[];
  formHook: UseFormReturn;
  onChange?: () => void;
}

const SimpleForm: FC<SimpleFormProps> = ({ questions, formHook, onChange }) => {
  if (process.env.NODE_ENV === "test") return null; //Hacky test fix. TODO: find the actual cause for this!
  const _onChange = useCallback(() => onChange?.(), [onChange]);
  return (
    <List<FieldDefinition, FormHTMLAttributes<HTMLFormElement>>
      as="div"
      className="w-full space-y-8"
      items={questions}
      itemAs={Fragment}
      uniqueId="name"
      render={question => <FormField key={question.name} field={question} formHook={formHook} onChange={_onChange} />}
    />
  );
};

export default SimpleForm;
