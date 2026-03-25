import { Dictionary } from "lodash";
import { FC } from "react";

import { SharedDetailStep } from "@/components/extensive/PageElements/PageContent/components/sharedDetails";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { FormStepWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import WizardFormProvider from "@/context/wizardForm.provider";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useEntityFormSetup } from "@/hooks/useEntityFormSetup";

interface SiteDetailsTabProps {
  site: SiteFullDto;
}

type DetailStepProps = {
  step: FormStepWithValidation;
  formValues: Dictionary<unknown>;
  site: SiteFullDto;
};

const DetailStep: FC<DetailStepProps> = ({ step, formValues, site }) => (
  <SharedDetailStep
    step={step}
    formValues={formValues}
    entityName="sites"
    entityUUID={site.uuid}
    entityStatus={site.status}
    updateRequestStatus={site.updateRequestStatus}
    additionalInfoTitle="Tree Species - Additional Information"
  />
);

const SiteDetailTab: FC<SiteDetailsTabProps> = ({ site }) => {
  const { steps, defaultValues, fieldsProvider, isFormLoading, providerLoaded } = useEntityFormSetup(
    "sites",
    site.uuid
  );

  if (isFormLoading || !providerLoaded) {
    return null;
  }

  return (
    <PageContent className="gap-2 bg-theme-neutral-100">
      <WizardFormProvider fieldsProvider={fieldsProvider}>
        {steps.map(step => (
          <DetailStep key={step.id} step={step} formValues={defaultValues} site={site} />
        ))}
      </WizardFormProvider>
    </PageContent>
  );
};

export default SiteDetailTab;
