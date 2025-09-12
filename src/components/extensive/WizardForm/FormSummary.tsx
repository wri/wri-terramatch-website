import { useMemo } from "react";

import FormSummaryRow from "@/components/extensive/WizardForm/FormSummaryRow";
import { useFormSections } from "@/connections/util/Form";
import { Entity } from "@/types/common";

import List from "../List/List";

export interface FormSummaryProps {
  values: any;
  formUuid: string;
  onEdit?: (stepIndex: number) => void;
  entity?: Entity;
  organisation?: any;
}

export type FormSummaryOptions = {
  title: string;
  subtitle?: string;
};

const FormSummary = (props: FormSummaryProps) => {
  const sections = useFormSections(props.formUuid);
  const sectionIds = useMemo(() => (sections ?? []).map(({ uuid }) => uuid), [sections]);
  return (
    <List
      className="space-y-8"
      items={sectionIds}
      render={(sectionId, index) => <FormSummaryRow index={index} sectionId={sectionId} {...props} />}
    />
  );
};

export default FormSummary;
