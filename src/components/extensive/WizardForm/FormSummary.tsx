import classNames from "classnames";

import FormSummaryRow from "@/components/extensive/WizardForm/FormSummaryRow";
import FeedbackReviewer from "@/components/extensive/WizardForm/FormSummaryRow/FeedbackReviewer";
import { useFieldsProvider } from "@/context/wizardForm.provider";

import List from "../List/List";

export interface FormSummaryProps {
  values: any;
  onEdit?: (stepIndex: number) => void;
  feedbackFieldsOptions?: string[] | null;
}

export type FormSummaryOptions = {
  title: string;
  subtitle?: string;
  feedbackFieldsOptions?: string[];
};

const FormSummary = (props: FormSummaryProps) => {
  const { feedbackFieldsOptions } = props;
  const stepIds = useFieldsProvider().stepIds();
  const hasFeedback = Array.isArray(feedbackFieldsOptions) && feedbackFieldsOptions.length > 0;

  return (
    <div className="space-y-6">
      {hasFeedback && (
        <FeedbackReviewer feedbackFieldsOptions={feedbackFieldsOptions} stepIds={stepIds} values={props.values} />
      )}
      <List
        className={classNames("space-y-6", { "space-y-4": hasFeedback })}
        items={stepIds}
        render={(stepId, index) => <FormSummaryRow index={index} stepId={stepId} {...props} />}
      />
    </div>
  );
};

export default FormSummary;
