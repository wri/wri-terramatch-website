import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC } from "react";
import * as yup from "yup";

import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import { getFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow/getFormEntries";
import { STEP_QUERY_PARAM } from "@/components/extensive/WizardForm/useFormNavigation";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { v3EntityName } from "@/helpers/entity";
import { useEntityFormSetup } from "@/hooks/useEntityFormSetup";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import {
  FULL_WIDTH_TABLE_HEADER_STYLES,
  NO_HEADER_TABLE_WRAPPER_STYLES
} from "@/redesignComponents/dataDisplay/Table/tableStyles";
import { Edit } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

interface ProjectDetailsTabProps {
  project: ProjectFullDto;
}

const EditButton: FC<{ onClick: () => void; text: string }> = ({ onClick, text }) => (
  <Button variant="secondary" size="small" leftIcon={<Edit boxSize={4} />} onClick={onClick}>
    {text}
  </Button>
);

const getFieldsRequiringAttentionCount = (
  validation: yup.ObjectSchema<Record<string, unknown>>,
  values: Record<string, unknown> | undefined
): number => {
  if (values == null) return 0;
  try {
    validation.validateSync(values, { abortEarly: false });
    return 0;
  } catch (err: unknown) {
    const yupError = err as { inner?: unknown[] };
    return yupError.inner?.length ?? 0;
  }
};

const noCountTableColumns = [
  { key: "name", label: "" },
  { key: "name", label: "" },
  { key: "name", label: "" },
  { key: "name", label: "" }
];

const ProjectDetailTab = ({ project }: ProjectDetailsTabProps) => {
  const t = useT();
  const router = useRouter();
  const { steps, defaultValues, fieldsProvider, isFormLoading, providerLoaded } = useEntityFormSetup(
    "projects",
    project?.uuid
  );

  const formValues = defaultValues ?? {};

  if (isFormLoading || !providerLoaded) {
    return null;
  }

  const noGoalTableColumns = [
    { key: "name", label: t("Species Name") },
    { key: "amount", label: t("Number of Trees Expected") }
  ];
  return (
    <PageBody className="mx-auto w-[82vw] bg-theme-neutral-100 px-4 py-2">
      <Flex flexDirection="column" gap={2}>
        {steps.map(step => {
          const isValid = step.validation.isValidSync(formValues);
          const fieldsRequiringAttention = getFieldsRequiringAttentionCount(step.validation, formValues);
          const entries = getFormEntries(
            fieldsProvider,
            {
              stepId: step.id,
              values: formValues,
              nullText: "Answer Not Provided",
              type: "projects",
              entity: { entityName: "projects", entityUUID: project.uuid }
            },
            t
          );

          return (
            <Accordion
              key={step.id}
              header={
                <AccordionHeader
                  title={step.title ?? ""}
                  status={isValid ? "complete" : "error"}
                  badge={
                    !isValid && fieldsRequiringAttention > 0
                      ? t("{count} requires attention", { count: fieldsRequiringAttention })
                      : undefined
                  }
                />
              }
              actions={
                <EditButton
                  onClick={() =>
                    router.push(
                      `/entity/${v3EntityName("projects")}/edit/${
                        project?.uuid
                      }?${STEP_QUERY_PARAM}=${encodeURIComponent(step.id)}`
                    )
                  }
                  text={t("Edit")}
                />
              }
            >
              <Flex flexDirection="column" gap={3}>
                {entries.map((entry, index) => (
                  <Flex key={`${step.id}-${entry.title}-${index}`} direction="column" gap={1}>
                    {entry.inputType === "file" ? (
                      <Flex direction="column" gap={2} marginBottom={2}>
                        <Text textStyle="500" color="neutral.700">
                          {entry.title}:
                        </Text>
                        <SimpleDivider />
                      </Flex>
                    ) : (
                      <Text textStyle="300-bold" color="primary.900">
                        {entry.title}:
                      </Text>
                    )}
                    {(() => {
                      const rawValue = entry.value ?? "-";
                      if (typeof rawValue === "string" || typeof rawValue === "number") {
                        return (
                          <Text
                            textStyle="400"
                            color="neutral.900"
                            dangerouslySetInnerHTML={{ __html: formatEntryValue(rawValue) }}
                          />
                        );
                      }
                      if (rawValue.props.tableType == "noCount") {
                        return (
                          <Table
                            data={rawValue.props.plants}
                            columns={noCountTableColumns}
                            variant="full-width"
                            css={NO_HEADER_TABLE_WRAPPER_STYLES}
                            totalItems={rawValue.props.plants.length}
                            showItemCount={false}
                          />
                        );
                      } else if (rawValue.props.tableType == "noGoal") {
                        return (
                          <Table
                            data={rawValue.props.plants}
                            columns={noGoalTableColumns}
                            css={FULL_WIDTH_TABLE_HEADER_STYLES}
                            totalItems={rawValue.props.plants.length}
                            showItemCount={false}
                          />
                        );
                      } else {
                        return (
                          <Text textStyle="400" color="neutral.900">
                            {formatEntryValue(rawValue)}
                          </Text>
                        );
                      }
                    })()}
                  </Flex>
                ))}
              </Flex>
            </Accordion>
          );
        })}
      </Flex>
    </PageBody>
  );
};

export default ProjectDetailTab;
