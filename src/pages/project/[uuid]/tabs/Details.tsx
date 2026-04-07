import { Dictionary } from "lodash";
import { FC } from "react";

import SharedDetails from "@/components/extensive/PageElements/PageContent/components/sharedDetails";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { FormStepWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import WizardFormProvider from "@/context/wizardForm.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useEntityFormSetup } from "@/hooks/useEntityFormSetup";

interface ProjectDetailsTabProps {
  project: ProjectFullDto;
}

type SharedDetailsStepProps = {
  step: FormStepWithValidation;
  formValues: Dictionary<unknown>;
  project: ProjectFullDto;
  stepIndex: number;
};

const SharedDetailsStep: FC<SharedDetailsStepProps> = ({ step, formValues, project, stepIndex }) => (
  <SharedDetails
    step={step}
    formValues={formValues}
    entityName="projects"
    entityUUID={project.uuid}
    entityStatus={project.status}
    updateRequestStatus={project.updateRequestStatus}
    entity={project}
    stepIndex={stepIndex}
    feedbackFieldsOptions={project.feedbackFields}
  />
);

const ProjectDetailTab: FC<ProjectDetailsTabProps> = ({ project }) => {
  const { steps, defaultValues, fieldsProvider, isFormLoading, providerLoaded } = useEntityFormSetup(
    "projects",
    project?.uuid
  );

  const formValues = defaultValues ?? {};

  if (isFormLoading || !providerLoaded) {
    return null;
  }

  return (
    <PageContent className="gap-2 bg-theme-neutral-100 sm:px-32">
      <WizardFormProvider fieldsProvider={fieldsProvider}>
        {steps.map((step, index) => (
          <SharedDetailsStep key={step.id} step={step} formValues={formValues} project={project} stepIndex={index} />
        ))}
      </WizardFormProvider>
    </PageContent>
  );
};

export default ProjectDetailTab;
