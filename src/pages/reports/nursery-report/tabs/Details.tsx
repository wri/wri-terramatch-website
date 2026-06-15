import { Dictionary } from "lodash";
import { FC } from "react";

import SharedDetails from "@/components/extensive/PageElements/PageContent/components/sharedDetails";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { FormStepWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import WizardFormProvider from "@/context/wizardForm.provider";
import { NurseryReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useEntityFormSetup } from "@/hooks/useEntityFormSetup";
import { useProjectOrgFormData } from "@/hooks/useProjectOrgFormData";

interface NurseryReportDetailsTabProps {
  report: NurseryReportFullDto;
}

type SharedDetailsStepProps = {
  step: FormStepWithValidation;
  formValues: Dictionary<unknown>;
  report: NurseryReportFullDto;
  stepIndex: number;
};

const SharedDetailsStep: FC<SharedDetailsStepProps> = ({ step, formValues, report, stepIndex }) => (
  <SharedDetails
    step={step}
    formValues={formValues}
    entityName="nursery-reports"
    entityUUID={report.uuid}
    entityStatus={report.status}
    updateRequestStatus={report.updateRequestStatus}
    stepIndex={stepIndex}
    entity={report}
    feedbackFieldsOptions={report.feedbackFields}
  />
);

const NurseryReportDetailsTab: FC<NurseryReportDetailsTabProps> = ({ report }) => {
  const { steps, defaultValues, fieldsProvider, isFormLoading, providerLoaded } = useEntityFormSetup(
    "nursery-reports",
    report.uuid
  );
  const { orgDetails, isLoading: orgLoading } = useProjectOrgFormData("nursery-reports", report);

  const formValues = defaultValues ?? {};

  if (isFormLoading || !providerLoaded || orgLoading) {
    return null;
  }

  return (
    <PageContent className="gap-2 bg-theme-neutral-100 sm:px-32">
      <WizardFormProvider fieldsProvider={fieldsProvider} orgDetails={orgDetails}>
        {steps.map((step, index) => (
          <SharedDetailsStep key={step.id} step={step} formValues={formValues} report={report} stepIndex={index} />
        ))}
      </WizardFormProvider>
    </PageContent>
  );
};

export default NurseryReportDetailsTab;
