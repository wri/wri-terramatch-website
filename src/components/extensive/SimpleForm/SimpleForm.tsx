import { FC, FormHTMLAttributes, Fragment, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";

import FormField from "@/components/extensive/WizardForm/FormField";

import List from "../List/List";

export interface SimpleFormProps {
  fieldIds: string[];
  formHook: UseFormReturn;
  onChange?: () => void;
}

const SimpleForm: FC<SimpleFormProps> = ({ fieldIds, formHook, onChange }) => {
  const _onChange = useCallback(() => onChange?.(), [onChange]);
  return (
    <List<string, FormHTMLAttributes<HTMLFormElement>>
      as="div"
      className="w-full space-y-8"
      items={fieldIds}
      itemAs={Fragment}
      uniqueId="name"
      render={fieldId => <FormField key={fieldId} fieldId={fieldId} formHook={formHook} onChange={_onChange} />}
    />
  );
};

export default SimpleForm;
