import { Dictionary } from "lodash";
import { useRouter } from "next/router";
import { FC } from "react";

import SiteDataTable from "@/components/entityData/SiteDataTable";
import SharedDetails from "@/components/extensive/PageElements/PageContent/components/sharedDetails";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { FormStepWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import WizardFormProvider from "@/context/wizardForm.provider";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useEntityFormSetup } from "@/hooks/useEntityFormSetup";
import { useProjectOrgFormData } from "@/hooks/useProjectOrgFormData";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";

interface SiteDetailsTabProps {
  site: SiteFullDto;
}

type SharedDetailsStepProps = {
  step: FormStepWithValidation;
  formValues: Dictionary<unknown>;
  site: SiteFullDto;
  stepIndex: number;
  feedbackBaselineValues?: Dictionary<unknown>;
};

const SharedDetailsStep: FC<SharedDetailsStepProps> = ({
  step,
  formValues,
  site,
  stepIndex,
  feedbackBaselineValues
}) => (
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
    feedbackBaselineValues={feedbackBaselineValues}
  />
);

const SiteDetailTab: FC<SiteDetailsTabProps> = ({ site }) => {
  const router = useRouter();
  const { steps, defaultValues, fieldsProvider, isReady, feedbackBaselineValues } = useEntityFormSetup(
    "sites",
    site.uuid
  );
  const { orgDetails, isLoading: orgLoading } = useProjectOrgFormData("sites", site);

  if (!isReady || orgLoading) {
    return null;
  }

  return (
    <PageContent className="gap-2 bg-theme-neutral-100 sm:px-32">
      {/* The single polygon home. Geometry editing, upload, and validation review live in the heavier
          workspace, opened from here rather than shown as a second, redundant polygon tab. */}
      <PageItem
        title="Site Polygons"
        flexProps={{ width: "100%" }}
        buttonProps={{
          variant: "secondary",
          size: "small",
          children: "Open polygon editor",
          rightIcon: <ChevronRightIcon />,
          onClick: () => router.push(`/site/${site.uuid}?tab=polygons`)
        }}
      >
        <SiteDataTable siteUuid={site.uuid} projectUuid={site.projectUuid ?? ""} />
      </PageItem>
      <WizardFormProvider fieldsProvider={fieldsProvider} orgDetails={orgDetails}>
        {steps.map((step, index) => (
          <SharedDetailsStep
            key={step.id}
            step={step}
            formValues={defaultValues}
            site={site}
            stepIndex={index}
            feedbackBaselineValues={feedbackBaselineValues}
          />
        ))}
      </WizardFormProvider>
    </PageContent>
  );
};

export default SiteDetailTab;
