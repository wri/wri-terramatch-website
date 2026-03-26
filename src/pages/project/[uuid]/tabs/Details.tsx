import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { FC } from "react";

import { PLANTING_STATUS_MAP } from "@/components/elements/Status/constants/statusMap";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { FormStepWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import WizardFormProvider from "@/context/wizardForm.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useEntityFormSetup } from "@/hooks/useEntityFormSetup";
import { ProgressTag } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import { ArrowForward } from "@/redesignComponents/foundations/Icons";

import { SharedDetailStep } from "../../../../components/extensive/PageElements/PageContent/components/sharedDetails";
import { getPlantingStatus } from "./constants/Detail.constants";

interface ProjectDetailsTabProps {
  project: ProjectFullDto;
}

const ProjectStageBlock: FC<{ project: ProjectFullDto }> = ({ project }) => {
  const t = useT();
  return (
    <Flex direction="column" gap={1}>
      <Text textStyle="300-bold" color="primary.900">
        {t("Project Stage")}:
      </Text>
      {project.plantingStatus !== null ? (
        <div className="flex items-center gap-2">
          <ProgressTag state={getPlantingStatus(project.plantingStatus)} />
          {(project.plantingStatus === "replacement-planting" ||
            project.plantingStatus === "no-restoration-expected") && (
            <>
              <ArrowForward boxSize={4} color="neutral.900" />
              <Text textStyle="400" color="neutral.900">
                {t(PLANTING_STATUS_MAP[project.plantingStatus!])}
              </Text>
            </>
          )}
        </div>
      ) : (
        "-"
      )}
    </Flex>
  );
};

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
    additionalInfoTitle="Additional Information"
    afterFirstEntry={stepIndex === 0 ? <ProjectStageBlock project={project} /> : undefined}
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
