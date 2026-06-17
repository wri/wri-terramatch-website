import { Dictionary } from "lodash";
import { FC } from "react";

import SharedDetails from "@/components/extensive/PageElements/PageContent/components/sharedDetails";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { FormStepWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import Loader from "@/components/generic/Loading/Loader";
import WizardFormProvider from "@/context/wizardForm.provider";
import { SiteReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useEntityFormSetup } from "@/hooks/useEntityFormSetup";
import { useProjectOrgFormData } from "@/hooks/useProjectOrgFormData";
import NothingToReportEmptyState from "@/pages/reports/site-report/components/NothingToReportEmptyState";

interface SiteReportDetailsTabProps {
  report: SiteReportFullDto;
}

type SharedDetailsStepProps = {
  step: FormStepWithValidation;
  formValues: Dictionary<unknown>;
  report: SiteReportFullDto;
  stepIndex: number;
};

const SharedDetailsStep: FC<SharedDetailsStepProps> = ({ step, formValues, report, stepIndex }) => (
  <SharedDetails
    step={step}
    formValues={formValues}
    entityName="site-reports"
    entityUUID={report.uuid}
    entityStatus={report.status}
    updateRequestStatus={report.updateRequestStatus}
    stepIndex={stepIndex}
    entity={report}
    feedbackFieldsOptions={report.feedbackFields}
  />
);

const SiteReportDetailsTab: FC<SiteReportDetailsTabProps> = ({ report }) => {
  const { steps, defaultValues, fieldsProvider, isFormLoading, providerLoaded } = useEntityFormSetup(
    "site-reports",
    report.uuid
  );
  const { orgDetails, isLoading: orgLoading } = useProjectOrgFormData("site-reports", report);

  const formValues = defaultValues ?? {};

  if (report.nothingToReport) {
    return (
      <PageContent className="gap-2 bg-theme-neutral-100 sm:px-32">
        <NothingToReportEmptyState />
      </PageContent>
    );
  }

  if (isFormLoading || !providerLoaded || orgLoading) {
    return (
      <PageContent className="gap-2 bg-theme-neutral-100 sm:px-32">
        <Loader className="h-32 w-full" />
      </PageContent>
    );
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

export default SiteReportDetailsTab;
