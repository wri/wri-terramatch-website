import { Dictionary } from "lodash";
import { FC } from "react";

import SharedDetails from "@/components/extensive/PageElements/PageContent/components/sharedDetails";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { FormStepWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import WizardFormProvider from "@/context/wizardForm.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useEntityFormSetup } from "@/hooks/useEntityFormSetup";
import { useProjectOrgFormData } from "@/hooks/useProjectOrgFormData";

interface ProjectDetailsTabProps {
  project: ProjectFullDto;
}

type SharedDetailsStepProps = {
  step: FormStepWithValidation;
  formValues: Dictionary<unknown>;
  project: ProjectFullDto;
  stepIndex: number;
  feedbackBaselineValues?: Dictionary<unknown>;
};

const SharedDetailsStep: FC<SharedDetailsStepProps> = ({
  step,
  formValues,
  project,
  stepIndex,
  feedbackBaselineValues
}) => (
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
    feedbackBaselineValues={feedbackBaselineValues}
  />
);

const ProjectDetailTab: FC<ProjectDetailsTabProps> = ({ project }) => {
  const { steps, defaultValues, fieldsProvider, isReady, feedbackBaselineValues } = useEntityFormSetup(
    "projects",
    project?.uuid
  );
  const { orgDetails, isLoading: orgLoading } = useProjectOrgFormData("projects", project);

  const formValues = defaultValues ?? {};

  if (!isReady || orgLoading) {
    return null;
  }

  return (
    <PageContent className="bg-theme-neutral-100 gap-2 sm:px-32">
      <WizardFormProvider fieldsProvider={fieldsProvider} orgDetails={orgDetails}>
        {steps.map((step, index) => (
          <SharedDetailsStep
            key={step.id}
            step={step}
            formValues={formValues}
            project={project}
            stepIndex={index}
            feedbackBaselineValues={feedbackBaselineValues}
          />
        ))}
      </WizardFormProvider>
    </PageContent>
  );
};

export default ProjectDetailTab;
