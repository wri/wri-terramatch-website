import { Dictionary } from "lodash";
import { FC } from "react";

import SharedDetails from "@/components/extensive/PageElements/PageContent/components/sharedDetails";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { FormStepWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import WizardFormProvider from "@/context/wizardForm.provider";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useEntityFormSetup } from "@/hooks/useEntityFormSetup";
import { useProjectOrgFormData } from "@/hooks/useProjectOrgFormData";

interface SiteDetailsTabProps {
  site: SiteFullDto;
}

type SharedDetailsStepProps = {
  step: FormStepWithValidation;
  formValues: Dictionary<unknown>;
  site: SiteFullDto;
  stepIndex: number;
};

const SharedDetailsStep: FC<SharedDetailsStepProps> = ({ step, formValues, site, stepIndex }) => (
  <SharedDetails
    step={step}
    formValues={formValues}
    entityName="sites"
    entityUUID={site.uuid}
    entityStatus={site.status}
    updateRequestStatus={site.updateRequestStatus}
    stepIndex={stepIndex}
    entity={site}
    feedbackFieldsOptions={site.feedbackFields}
  />
);

const SiteDetailTab: FC<SiteDetailsTabProps> = ({ site }) => {
  const { steps, defaultValues, fieldsProvider, isFormLoading, providerLoaded } = useEntityFormSetup(
    "sites",
    site.uuid
  );
  const { orgDetails, isLoading: orgLoading } = useProjectOrgFormData("sites", site);

  if (isFormLoading || !providerLoaded || orgLoading) {
    return null;
  }

  return (
    <PageContent className="gap-2 bg-theme-neutral-100 sm:px-32">
      <WizardFormProvider fieldsProvider={fieldsProvider} orgDetails={orgDetails}>
        {steps.map((step, index) => (
          <SharedDetailsStep key={step.id} step={step} formValues={defaultValues} site={site} stepIndex={index} />
        ))}
      </WizardFormProvider>
    </PageContent>
  );
};

export default SiteDetailTab;
