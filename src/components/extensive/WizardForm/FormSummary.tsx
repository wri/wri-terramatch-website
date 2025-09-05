import FormSummaryRow from "@/components/extensive/WizardForm/FormSummaryRow";
import { useFormSectionIds } from "@/connections/util/Form";
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

const FormSummary = (props: FormSummaryProps) => (
  <List
    className="space-y-8"
    items={useFormSectionIds(props.formUuid)}
    render={(sectionId, index) => <FormSummaryRow index={index} sectionId={sectionId} {...props} />}
  />
);

export default FormSummary;
