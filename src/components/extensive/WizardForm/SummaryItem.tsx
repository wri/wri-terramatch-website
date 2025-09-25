import { useT } from "@transifex/react";
import { FC, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";

import { FormFooter } from "@/components/extensive/WizardForm/FormFooter";
import FormStepHeader from "@/components/extensive/WizardForm/FormStepHeader";
import FormSummary from "@/components/extensive/WizardForm/FormSummary";
import { downloadAnswersCSV } from "@/components/extensive/WizardForm/utils";
import { useFieldsProvider } from "@/context/wizardForm.provider";

type SummaryItemProps = {
  title: string;
  subtitle?: string;
  formHook: UseFormReturn;
  downloadButtonText?: string;
  setSelectedStepIndex: (value: SetStateAction<number>) => void;
  onSubmitStep: (data: any) => void;
  submitButtonDisable?: boolean;
};

const SummaryItem: FC<SummaryItemProps> = ({
  title,
  subtitle,
  formHook,
  downloadButtonText,
  setSelectedStepIndex,
  onSubmitStep,
  submitButtonDisable
}) => {
  const t = useT();
  const fieldsProvider = useFieldsProvider();
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
                onClick: () => downloadAnswersCSV(fieldsProvider, formHook.getValues())
              }
        }
      >
        <FormSummary values={formHook.getValues()} onEdit={setSelectedStepIndex} />
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
