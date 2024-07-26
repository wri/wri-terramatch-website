import FormSummaryRow from "@/components/extensive/WizardForm/FormSummaryRow";

import List from "../List/List";
import { FormStepSchema } from "./types";

export interface FormSummaryProps {
  values: any;
  steps: FormStepSchema[];
  onEdit?: (stepIndex: number) => void;
}

export type FormSummaryOptions = {
  title: string;
  subtitle?: string;
};

const FormSummary = (props: FormSummaryProps) => {
  return (
    <List
      className="space-y-8"
      items={props.steps}
      render={(step, index) => <FormSummaryRow index={index} step={step} {...props} />}
    />
  );
};

export default FormSummary;
