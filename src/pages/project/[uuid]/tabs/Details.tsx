import { Dictionary } from "lodash";
import { FC } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { FormStepWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import WizardFormProvider from "@/context/wizardForm.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useEntityFormSetup } from "@/hooks/useEntityFormSetup";

import { SharedDetailStep } from "../../../../components/extensive/PageElements/PageContent/components/sharedDetails";

interface ProjectDetailsTabProps {
  project: ProjectFullDto;
}

type DetailStepProps = {
  step: FormStepWithValidation;
  formValues: Dictionary<unknown>;
  project: ProjectFullDto;
  stepIndex: number;
};

const DetailStep: FC<DetailStepProps> = ({ step, formValues, project, stepIndex }) => (
  <SharedDetailStep
    step={step}
    formValues={formValues}
    entityName="projects"
    entityUUID={project.uuid}
    entityStatus={project.status}
    updateRequestStatus={project.updateRequestStatus}
    entity={project}
    stepIndex={stepIndex}
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
    <PageContent className="bg-theme-neutral-100 gap-2 sm:px-32">
      <WizardFormProvider fieldsProvider={fieldsProvider}>
        {steps.map((step, index) => (
          <DetailStep key={step.id} step={step} formValues={formValues} project={project} stepIndex={index} />
        ))}
      </WizardFormProvider>
    </PageContent>
  );
};

export default ProjectDetailTab;
