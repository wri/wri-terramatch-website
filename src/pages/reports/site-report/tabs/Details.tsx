import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { FC } from "react";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import { IconNames } from "@/components/extensive/Icon/Icon";
import SharedDetails from "@/components/extensive/PageElements/PageContent/components/sharedDetails";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { FormStepWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import WizardFormProvider from "@/context/wizardForm.provider";
import { SiteReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useEntityFormSetup } from "@/hooks/useEntityFormSetup";
import { useProjectOrgFormData } from "@/hooks/useProjectOrgFormData";

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
  const t = useT();
  const { steps, defaultValues, fieldsProvider, isFormLoading, providerLoaded } = useEntityFormSetup(
    "site-reports",
    report.uuid
  );
  const { orgDetails, isLoading: orgLoading } = useProjectOrgFormData("site-reports", report);

  const formValues = defaultValues ?? {};

  if (report.nothingToReport) {
    return (
      <PageContent className="gap-2 bg-theme-neutral-100 sm:px-32">
        <EmptyState
          iconProps={{ name: IconNames.DOCUMENT_CIRCLE, className: "fill-success" }}
          title={t("Nothing to report")}
          subtitle={t(
            "You've marked this report as 'Nothing to Report,' indicating there are no updates for this site report. If you wish to add information to this report, please use the edit button."
          )}
        />
      </PageContent>
    );
  }

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

export default SiteReportDetailsTab;
