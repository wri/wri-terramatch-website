import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { useRouter } from "next/router";
import { FC, Fragment } from "react";

import { PLANTING_STATUS_MAP } from "@/components/elements/Status/constants/statusMap";
import { hasFeedbackInStep } from "@/components/extensive/WizardForm/feedbackUtils";
import { useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow/getFormEntries";
import { STEP_QUERY_PARAM } from "@/components/extensive/WizardForm/useFormNavigation";
import { FormStepWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import { useFieldsProvider } from "@/context/wizardForm.provider";
import { ProjectFullDto, SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { isEntityAwaitingApproval, v3EntityName } from "@/helpers/entity";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { getPlantingStatus } from "@/pages/project/[uuid]/tabs/constants/Detail.constants";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { ProgressTag } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";
import { ArrowForwardIcon, EditIcon } from "@/redesignComponents/foundations/Icons";

import { getFieldsRequiringAttentionCount, plantsToNoCountRows } from "../utils/detailUtils";
import { EntryDefaultValueRenderer } from "./EntryDefaultValueRenderer";
import SpecialEntryRenderer, { SPECIAL_ENTRY_TITLES } from "./SpecialEntryRenderer";

export { getFieldsRequiringAttentionCount, plantsToNoCountRows };

const EditButton: FC<{ onClick: () => void; text: string }> = ({ onClick, text }) => (
  <Button variant="secondary" size="small" leftIcon={<EditIcon boxSize={4} />} onClick={onClick}>
    {text}
  </Button>
);

export type SharedDetailsProps = {
  step: FormStepWithValidation;
  formValues: Dictionary<unknown>;
  entityName: "projects" | "sites";
  entityUUID: string;
  entityStatus?: string | null;
  updateRequestStatus?: string | null;
  stepIndex: number;
  entity: ProjectFullDto | SiteFullDto;
  feedbackFieldsOptions?: string[] | null;
};

const SharedDetails: FC<SharedDetailsProps> = ({
  step,
  formValues,
  entityName,
  entityUUID,
  entityStatus,
  updateRequestStatus,
  stepIndex,
  entity,
  feedbackFieldsOptions
}) => {
  const t = useT();
  const router = useRouter();
  const fieldsProvider = useFieldsProvider();

  const isValid = step.validation.isValidSync(formValues);
  const hasStepFeedback = hasFeedbackInStep(fieldsProvider, step.id, feedbackFieldsOptions);
  const accordionHeaderStatus = !isValid ? "error" : hasStepFeedback ? "warning" : "complete";
  const fieldsRequiringAttention = getFieldsRequiringAttentionCount(step.validation, formValues);

  const entries = useGetFormEntries({
    stepId: step.id,
    values: formValues,
    nullText: t("Answer Not Provided"),
    entity: { entityName, entityUUID },
    type: entityName
  });

  const { handleEdit } = useGetEditEntityHandler({
    entityName,
    entityUUID,
    entityStatus: entityStatus ?? "started",
    updateRequestStatus: updateRequestStatus ?? "no-update"
  });

  return entries.length === 0 ? null : (
    <Accordion
      key={step.id}
      header={
        <AccordionHeader
          title={step.title ?? ""}
          status={accordionHeaderStatus}
          badge={
            !isValid && fieldsRequiringAttention > 0
              ? t("{count} requires attention", { count: fieldsRequiringAttention })
              : undefined
          }
        />
      }
      actions={
        <EditButton
          onClick={() => {
            if (isEntityAwaitingApproval(entityStatus, updateRequestStatus)) {
              handleEdit();
            } else {
              router.push(
                `/entity/${v3EntityName(entityName)}/edit/${entityUUID}?${STEP_QUERY_PARAM}=${encodeURIComponent(
                  step.id
                )}`
              );
            }
          }}
          text={t("Edit")}
        />
      }
    >
      <Flex flexDirection="column" gap={3}>
        {entries.map((entry, index) => {
          const projectStageSection = stepIndex === 0 && index === 0 && entityName === "projects" && (
            <Flex direction="column" gap={1}>
              <Text textStyle="300-bold" color="primary.900">
                {t("Project Stage")}:
              </Text>
              {entity.plantingStatus !== null ? (
                <>
                  <div className="flex items-center gap-2">
                    <ProgressTag state={getPlantingStatus(entity.plantingStatus)} />
                    {(entity.plantingStatus === "replacement-planting" ||
                      entity.plantingStatus === "no-restoration-expected") && (
                      <>
                        <ArrowForwardIcon boxSize={4} color="neutral.900" />
                        <Text textStyle="400" color="neutral.900">
                          {t(PLANTING_STATUS_MAP[entity.plantingStatus!])}
                        </Text>
                      </>
                    )}
                  </div>
                </>
              ) : (
                "-"
              )}
            </Flex>
          );

          if (SPECIAL_ENTRY_TITLES.has(entry.title ?? "") || entry.inputType === "file") {
            return (
              <Fragment key={`${step.id}-${entry.title}-${index}`}>
                <SpecialEntryRenderer entry={entry} entityName={entityName} entityUUID={entityUUID} />
                {projectStageSection}
              </Fragment>
            );
          }

          return (
            <Fragment key={`${step.id}-${entry.title}-${index}`}>
              <Flex direction="column" gap={1}>
                <Text className="flex items-center gap-1 leading-normal" textStyle="300-bold" color="primary.900">
                  {entry.title}:
                </Text>
                <EntryDefaultValueRenderer entry={entry} />
              </Flex>
              {projectStageSection}
            </Fragment>
          );
        })}
      </Flex>
    </Accordion>
  );
};

export default SharedDetails;
