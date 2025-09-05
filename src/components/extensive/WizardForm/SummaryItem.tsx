import { useT } from "@transifex/react";
import { FC, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";

import { FormFooter } from "@/components/extensive/WizardForm/FormFooter";
import { useFormQuestions } from "@/components/extensive/WizardForm/formQuestions.provider";
import FormStepHeader from "@/components/extensive/WizardForm/FormStepHeader";
import FormSummary from "@/components/extensive/WizardForm/FormSummary";
import { downloadAnswersCSV } from "@/components/extensive/WizardForm/utils";

type SummaryItemProps = {
  formUuid: string;
  title: string;
  subtitle?: string;
  formHook: UseFormReturn;
  downloadButtonText?: string;
  setSelectedStepIndex: (value: SetStateAction<number>) => void;
  onSubmitStep: (data: any) => void;
  submitButtonDisable?: boolean;
};

const SummaryItem: FC<SummaryItemProps> = ({
  formUuid,
  title,
  subtitle,
  formHook,
  downloadButtonText,
  setSelectedStepIndex,
  onSubmitStep,
  submitButtonDisable
}) => {
  const t = useT();
  const { allQuestions } = useFormQuestions();
  return (
    <div className="overflow-auto sm:h-[calc(100vh-218px)] md:h-[calc(100vh-256px)] lg:h-[calc(100vh-268px)]">
      <FormStepHeader
        id="step"
        title={title}
        subtitle={subtitle}
        actionButtonProps={
          downloadButtonText == null
            ? undefined
            : {
                children: downloadButtonText,
                onClick: () => downloadAnswersCSV(allQuestions, formHook.getValues())
              }
        }
      >
        <FormSummary values={formHook.getValues()} formUuid={formUuid} onEdit={setSelectedStepIndex} />
      </FormStepHeader>
      <FormFooter
        variant="sticky"
        backButtonProps={{
          children: t("Back"),
          onClick: () => setSelectedStepIndex(n => n - 1)
        }}
        submitButtonProps={{
          children: t("Submit"),
          onClick: formHook.handleSubmit(onSubmitStep),
          disabled: submitButtonDisable,
          className: "py-3"
        }}
      />
    </div>
  );
};

export default SummaryItem;
