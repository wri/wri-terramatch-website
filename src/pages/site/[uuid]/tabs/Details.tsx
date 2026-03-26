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
  stepIndex: number;
};

const DetailStep: FC<DetailStepProps> = ({ step, formValues, site, stepIndex }) => (
  <SharedDetailStep
    step={step}
    formValues={formValues}
    entityName="sites"
    entityUUID={site.uuid}
    entityStatus={site.status}
    updateRequestStatus={site.updateRequestStatus}
    stepIndex={stepIndex}
    entity={site}
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
    <PageContent className="bg-theme-neutral-100 gap-2 sm:px-32">
      <WizardFormProvider fieldsProvider={fieldsProvider}>
        {steps.map((step, index) => (
          <DetailStep key={step.id} step={step} formValues={defaultValues} site={site} stepIndex={index} />
        ))}
      </WizardFormProvider>
    </PageContent>
  );
};

export default SiteDetailTab;
