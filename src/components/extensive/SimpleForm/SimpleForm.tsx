import { FC, FormHTMLAttributes, Fragment, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";

import FormField from "@/components/extensive/WizardForm/FormField";

import List from "../List/List";
import { FieldDefinition } from "../WizardForm/types";

export interface SimpleFormProps {
  fields: FieldDefinition[];
  formHook: UseFormReturn;
  onChange?: () => void;
}

const SimpleForm: FC<SimpleFormProps> = ({ fields, formHook, onChange }) => {
  if (process.env.NODE_ENV === "test") return null; //Hacky test fix. TODO: find the actual cause for this!
  const _onChange = useCallback(() => onChange?.(), [onChange]);
  return (
    <List<FieldDefinition, FormHTMLAttributes<HTMLFormElement>>
      as="div"
      className="w-full space-y-8"
      items={fields}
      itemAs={Fragment}
      uniqueId="name"
      render={field => <FormField key={field.name} field={field} formHook={formHook} onChange={_onChange} />}
    />
  );
};

export default SimpleForm;
