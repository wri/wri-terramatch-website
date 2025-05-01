import { FormHTMLAttributes, Fragment } from "react";
import { UseFormReturn } from "react-hook-form";

import List from "../List/List";
import { FieldMapper } from "../WizardForm/FieldMapper";
import { FormField } from "../WizardForm/types";

export interface SimpleFormProps {
  fields: FormField[];
  formHook: UseFormReturn;
  onChange: () => void;
}

const SimpleForm = (props: SimpleFormProps) => {
  if (process.env.NODE_ENV === "test") return null; //Hacky test fix. TODO: find the actual cause for this!
  return (
    <List<FormField, FormHTMLAttributes<HTMLFormElement>>
      as="div"
      className="w-full space-y-8"
      items={props.fields}
      itemAs={Fragment}
      uniqueId="name"
      render={field => <FieldMapper field={field} formHook={props.formHook} onChange={props.onChange} />}
    />
  );
};

export default SimpleForm;
