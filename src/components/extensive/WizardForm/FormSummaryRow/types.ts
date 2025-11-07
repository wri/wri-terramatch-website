import { Dictionary } from "lodash";

import { FormSummaryRowProps } from "@/components/extensive/WizardForm/FormSummaryRow/index";
import { FieldDefinition, FieldInputType, GetEntryValueProps } from "@/components/extensive/WizardForm/types";
import { Entity } from "@/types/common";

export type FormEntry = {
  title?: string;
  inputType: FieldInputType;
  value: any;
};

type EntryFactory = (field: FieldDefinition, formValues: Dictionary<any>, additional: GetEntryValueProps) => any;

export const addEntryWith =
  (factory: EntryFactory) =>
  (entries: FormEntry[], field: FieldDefinition, formValues: Dictionary<any>, additional: GetEntryValueProps) => {
    entries.push({
      title: field.label ?? "",
      inputType: field.inputType,
      value: factory(field, formValues, additional)
    });
  };

export type GetFormEntriesProps = Omit<FormSummaryRowProps, "index" | "onEdit" | "formUuid"> & {
  entity?: Entity;
};
