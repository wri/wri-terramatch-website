import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { useRouter } from "next/router";
import { FC, Fragment, useMemo } from "react";

import { PLANTING_STATUS_MAP } from "@/components/elements/Status/constants/statusMap";
import { countFeedbackInStep, countUnresolvedFeedbackInStep } from "@/components/extensive/WizardForm/feedbackUtils";
import { useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow/getFormEntries";
import { STEP_QUERY_PARAM, SUMMARY_ID } from "@/components/extensive/WizardForm/useFormNavigation";
import { FormStepWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import { useFieldsProvider } from "@/context/wizardForm.provider";
import {
  DisturbanceReportFullDto,
  FinancialReportFullDto,
  NurseryReportFullDto,
  ProjectFullDto,
  ProjectReportFullDto,
  SiteFullDto,
  SiteReportFullDto,
  SrpReportFullDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import { isEntityAwaitingApproval, isEntityReport, pluralEntityName } from "@/helpers/entity";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { getPlantingStatus } from "@/pages/project/[uuid]/tabs/constants/Detail.constants";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { ProgressTag } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";
import { ArrowForwardIcon, EditIcon } from "@/redesignComponents/foundations/Icons";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";
import { EntityName } from "@/types/common";
import { resolveReportEntityTypeFromEntityName } from "@/utils/analytics/reportAnalytics";
import { trackReportOverviewAccordionExpanded } from "@/utils/analytics/reportsIndexAnalytics";

import {
  countValidationErrors,
  EntryInlineIssue,
  getValidationErrorsByField,
  resolveEntryInlineIssue
} from "../utils/detailUtils";
import { EntryDefaultValueRenderer } from "./EntryDefaultValueRenderer";
import SpecialEntryRenderer, { SPECIAL_ENTRY_TITLES } from "./SpecialEntryRenderer";

export { getFieldsRequiringAttentionCount, plantsToNoCountRows } from "../utils/detailUtils";

const EditButton: FC<{ onClick: () => void; text: string }> = ({ onClick, text }) => (
  <Button variant="secondary" size="small" leftIcon={<EditIcon boxSize={4} />} onClick={onClick}>
    {text}
  </Button>
);

const EntryInlineIssueMessage: FC<{
  issue: EntryInlineIssue;
  onViewFeedback: () => void;
}> = ({ issue, onViewFeedback }) => {
  const t = useT();

  if (issue.kind === "feedback") {
    return (
      <InlineMessage
        label={t("Changes requested")}
        variant="error"
        className="mt-1 mb-3 w-fit"
        actionLabel={t("View feedback")}
        onActionClick={onViewFeedback}
        isButtonRight
        size="small"
      />
    );
  }

  if (issue.kind === "totals-match") {
    return (
      <InlineMessage
        label={t("Category totals must match. Please review your entries")}
        variant="error"
        className="mt-1 mb-3 w-fit"
        size="small"
      />
    );
  }

  return <InlineMessage label={t("Please complete this field")} variant="error" className="mt-1 w-fit" size="small" />;
};

export type SharedDetailsProps = {
  step: FormStepWithValidation;
  formValues: Dictionary<unknown>;
  entityName:
    | "projects"
    | "sites"
    | "project-reports"
    | "site-reports"
    | "nursery-reports"
    | "srp-reports"
    | "disturbance-reports"
    | "financial-reports";
  entityUUID: string;
  entityStatus?: string | null;
  updateRequestStatus?: string | null;
  stepIndex: number;
  entity:
    | ProjectFullDto
    | SiteFullDto
    | ProjectReportFullDto
    | SiteReportFullDto
    | NurseryReportFullDto
    | SrpReportFullDto
    | DisturbanceReportFullDto
    | FinancialReportFullDto;
  feedbackFieldsOptions?: string[] | null;
  feedbackBaselineValues?: Dictionary<unknown>;
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
  feedbackFieldsOptions,
  feedbackBaselineValues
}) => {
  const t = useT();
  const router = useRouter();
  const fieldsProvider = useFieldsProvider();

  const validationErrorsByField = useMemo(
    () => getValidationErrorsByField(step.validation, formValues),
    [step.validation, formValues]
  );
  const validationFieldsRequiringAttention = countValidationErrors(validationErrorsByField);
  const isValid = validationFieldsRequiringAttention === 0;

  const feedbackFieldsRequiringAttention =
    feedbackBaselineValues != null
      ? countUnresolvedFeedbackInStep(
          fieldsProvider,
          step.id,
          feedbackFieldsOptions,
          formValues,
          feedbackBaselineValues
        )
      : countFeedbackInStep(fieldsProvider, step.id, feedbackFieldsOptions);
  const hasStepFeedback = feedbackFieldsRequiringAttention > 0;
  const accordionHeaderStatus = !isValid || hasStepFeedback ? "error" : "complete";
  const fieldsRequiringAttention = hasStepFeedback
    ? Math.max(validationFieldsRequiringAttention, feedbackFieldsRequiringAttention)
    : validationFieldsRequiringAttention;

  const entries = useGetFormEntries({
    stepId: step.id,
    values: formValues,
    nullText: t("Answer Not Provided"),
    entity: { entityName, entityUUID },
    type: entityName
  });

  const { handleEdit, EditModals } = useGetEditEntityHandler({
    entityName,
    entityUUID,
    entityStatus: entityStatus ?? "draft",
    updateRequestStatus: updateRequestStatus!
  });

  const reportEntityType = resolveReportEntityTypeFromEntityName(entityName as EntityName);
  const accordionLabel = step.title?.trim() ?? "";

  const navigateToEdit = (targetStepId: string) => {
    if (isEntityReport(entityName as EntityName) || isEntityAwaitingApproval(entityStatus, updateRequestStatus)) {
      handleEdit(targetStepId);
    } else {
      router.push(
        `/entity/${pluralEntityName(entityName)}/edit/${entityUUID}?${STEP_QUERY_PARAM}=${encodeURIComponent(
          targetStepId
        )}`
      );
    }
  };

  const handleAccordionOpenChange = (open: boolean) => {
    if (!open || reportEntityType == null || accordionLabel === "") return;

    trackReportOverviewAccordionExpanded({
      entityType: reportEntityType,
      entityId: entityUUID,
      accordionLabel
    });
  };

  return entries.length === 0 ? null : (
    <>
      {EditModals}
      <Accordion
        key={step.id}
        onOpenChange={handleAccordionOpenChange}
        header={
          <AccordionHeader
            title={step.title ?? ""}
            badge={
              fieldsRequiringAttention > 0
                ? t("{count} requires attention", { count: fieldsRequiringAttention })
                : undefined
            }
          />
        }
        actions={<EditButton onClick={() => navigateToEdit(step.id)} text={t("Edit")} />}
      >
        <Flex flexDirection="column" gap={3}>
          {entries.map((entry, index) => {
            const projectStageSection = stepIndex === 0 && index === 0 && entityName === "projects" && (
              <Flex direction="column" gap={1}>
                <Text textStyle="300-bold" color="primary.900">
                  {t("Project Stage")}:
                </Text>
                {"plantingStatus" in entity && entity.plantingStatus !== null ? (
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

            const entryIssue = resolveEntryInlineIssue({
              entry,
              formValues,
              validationErrorsByField,
              fieldsProvider,
              feedbackFieldIds: feedbackFieldsOptions,
              feedbackBaselineValues
            });

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
                    {t(entry.title)}:
                  </Text>
                  {entryIssue != null && (
                    <EntryInlineIssueMessage issue={entryIssue} onViewFeedback={() => navigateToEdit(SUMMARY_ID)} />
                  )}
                  <EntryDefaultValueRenderer entry={entry} />
                </Flex>
                {projectStageSection}
              </Fragment>
            );
          })}
        </Flex>
      </Accordion>
    </>
  );
};

export default SharedDetails;
