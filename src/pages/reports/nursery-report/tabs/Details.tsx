import { Dictionary } from "lodash";
import { FC } from "react";

import SharedDetails from "@/components/extensive/PageElements/PageContent/components/sharedDetails";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { FormStepWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import Loader from "@/components/generic/Loading/Loader";
import WizardFormProvider from "@/context/wizardForm.provider";
import { NurseryReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useEntityFormSetup } from "@/hooks/useEntityFormSetup";
import { useProjectOrgFormData } from "@/hooks/useProjectOrgFormData";
import NothingToReportEmptyState from "@/pages/reports/nursery-report/components/NothingToReportEmptyState";

interface NurseryReportDetailsTabProps {
  report: NurseryReportFullDto;
}

type SharedDetailsStepProps = {
  step: FormStepWithValidation;
  formValues: Dictionary<unknown>;
  report: NurseryReportFullDto;
  stepIndex: number;
  feedbackBaselineValues?: Dictionary<unknown>;
};

const SharedDetailsStep: FC<SharedDetailsStepProps> = ({
  step,
  formValues,
  report,
  stepIndex,
  feedbackBaselineValues
}) => (
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
    feedbackBaselineValues={feedbackBaselineValues}
  />
);

const NurseryReportDetailsTab: FC<NurseryReportDetailsTabProps> = ({ report }) => {
  const { steps, defaultValues, fieldsProvider, isReady, feedbackBaselineValues } = useEntityFormSetup(
    "nursery-reports",
    report.uuid
  );
  const { orgDetails, isLoading: orgLoading } = useProjectOrgFormData("nursery-reports", report);

  const formValues = defaultValues ?? {};

  if (report.nothingToReport) {
    return (
      <PageContent className="bg-theme-neutral-100 gap-2 sm:px-32">
        <NothingToReportEmptyState />
      </PageContent>
    );
  }

  if (!isReady || orgLoading) {
    return (
      <PageContent className="bg-theme-neutral-100 gap-2 sm:px-32">
        <Loader className="h-32 w-full" />
      </PageContent>
    );
  }

  return (
    <PageContent className="bg-theme-neutral-100 gap-2 sm:px-32">
      <WizardFormProvider fieldsProvider={fieldsProvider} orgDetails={orgDetails}>
        {steps.map((step, index) => (
          <SharedDetailsStep
            key={step.id}
            step={step}
            formValues={formValues}
            report={report}
            stepIndex={index}
            feedbackBaselineValues={feedbackBaselineValues}
          />
        ))}
      </WizardFormProvider>
    </PageContent>
  );
};

export default NurseryReportDetailsTab;
