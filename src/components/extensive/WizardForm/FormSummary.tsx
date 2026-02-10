import FormSummaryRow from "@/components/extensive/WizardForm/FormSummaryRow";
import { useFieldsProvider } from "@/context/wizardForm.provider";

import List from "../List/List";

export interface FormSummaryProps {
  values: any;
  onEdit?: (stepIndex: number) => void;
}

export type FormSummaryOptions = {
  title: string;
  subtitle?: string;
};

const FormSummary = (props: FormSummaryProps) => {
  const stepIds = useFieldsProvider().stepIds();
  return (
    <List
      className="space-y-6"
      items={stepIds}
      render={(stepId, index) => <FormSummaryRow index={index} stepId={stepId} {...props} />}
    />
  );
};

export default FormSummary;
