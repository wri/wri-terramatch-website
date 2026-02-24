import { Box, Flex, TableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { FC } from "react";
import { When } from "react-if";
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

import {
  COUNT_TABLE_SPECIES_PER_PAGE_MIN,
  NO_COUNT_TABLE_SPECIES_PER_PAGE,
  NO_COUNT_TABLE_SPECIES_PER_ROW,
  noCountTableColumns
} from "./constants/Detail.constants";

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

  function plantsToNoCountRows(
    plants: Array<{ name?: string | null }>
  ): Array<Record<number, string> & { id: number }> {
    const rows: Array<Record<number, string> & { id: number }> = [];
    for (let i = 0; i < plants.length; i += NO_COUNT_TABLE_SPECIES_PER_ROW) {
      const row: Record<number, string> & { id: number } = {
        id: Math.floor(i / NO_COUNT_TABLE_SPECIES_PER_ROW) + 1
      };
      for (let j = 0; j < NO_COUNT_TABLE_SPECIES_PER_ROW; j++) {
        row[j + 1] = plants[i + j]?.name ?? "";
      }
      rows.push(row);
    }
    return rows;
  }
  return (
    <PageBody className="bg-theme-neutral-100 mx-auto w-[82vw] px-4 py-2">
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
                    {entry.title === "Additional Information" ? null : (
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
                        const noCountTableRowCount = rawValue.props.plants.length / NO_COUNT_TABLE_SPECIES_PER_ROW;
                        const dataPlants = plantsToNoCountRows(rawValue.props.plants);

                        return (
                          <Table
                            data={dataPlants}
                            columns={noCountTableColumns}
                            css={NO_HEADER_TABLE_WRAPPER_STYLES}
                            variant="full-width"
                            totalItems={noCountTableRowCount}
                            showItemCount={false}
                            pageSize={NO_COUNT_TABLE_SPECIES_PER_PAGE}
                            showPagination={NO_COUNT_TABLE_SPECIES_PER_PAGE < noCountTableRowCount}
                            className={classNames(
                              "mt-[2px]",
                              dataPlants.length <= NO_COUNT_TABLE_SPECIES_PER_PAGE ? "mb-3" : "aaaaaaa"
                            )}
                            renderRow={rowData => {
                              const row = rowData as Record<number, string> & { id: number };
                              return (
                                <TableRow>
                                  {noCountTableColumns.map((col, idx) => (
                                    <TableCell key={col.key + idx} className={idx === 0 ? undefined : "px-0! py-4"}>
                                      <When condition={row[idx + 1] !== undefined && row[idx + 1] !== ""}>
                                        <Box
                                          className={classNames(
                                            idx === noCountTableColumns.length - 1 ? "" : "mr-8",
                                            "border-theme-neutral-300 border-b py-4"
                                          )}
                                        >
                                          {row[idx + 1]}
                                        </Box>
                                      </When>
                                    </TableCell>
                                  ))}
                                </TableRow>
                              );
                            }}
                          />
                        );
                      } else if (rawValue.props.tableType == "noGoal") {
                        return (
                          <Table
                            data={rawValue.props.plants}
                            columns={noGoalTableColumns}
                            variant="full-width"
                            css={FULL_WIDTH_TABLE_HEADER_STYLES}
                            totalItems={rawValue.props.plants.length}
                            showItemCount={false}
                            className={classNames(
                              "mt-[2px] !w-[725px]",
                              rawValue.props.plants.length <= COUNT_TABLE_SPECIES_PER_PAGE_MIN ? "mb-3" : ""
                            )}
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
