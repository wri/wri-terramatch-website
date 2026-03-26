import { Box, Flex, Grid, TableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { Dictionary } from "lodash";
import { useRouter } from "next/router";
import { FC, Fragment, useMemo } from "react";

import { formatEntryValue } from "@/admin/apiProvider/utils/entryFormat";
import { PLANTING_STATUS_MAP } from "@/components/elements/Status/constants/statusMap";
import { useGetFormEntries } from "@/components/extensive/WizardForm/FormSummaryRow/getFormEntries";
import { ParsedFile, parseFilesFromHtml } from "@/components/extensive/WizardForm/FormSummaryRow/parseFilesFromHtml";
import { FormEntry } from "@/components/extensive/WizardForm/FormSummaryRow/types";
import { STEP_QUERY_PARAM } from "@/components/extensive/WizardForm/useFormNavigation";
import { FormStepWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import { ProjectFullDto, SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { isEntityAwaitingApproval, v3EntityName } from "@/helpers/entity";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import AttachFileItem from "@/pages/project/[uuid]/components/AttachFileItem";
import {
  COUNT_TABLE_SPECIES_PER_PAGE_MIN,
  getPlantingStatus,
  NO_COUNT_TABLE_SPECIES_PER_PAGE,
  NO_COUNT_TABLE_SPECIES_PER_ROW,
  noCountTableColumns
} from "@/pages/project/[uuid]/tabs/constants/Detail.constants";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { ProgressTag } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import AccordionHeader from "@/redesignComponents/containers/Accordion/AccordionHeader";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import {
  FULL_WIDTH_TABLE_HEADER_STYLES,
  NO_HEADER_TABLE_WRAPPER_STYLES
} from "@/redesignComponents/dataDisplay/Table/tableStyles";
import { ArrowForward, EditIcon, PhotosIcon } from "@/redesignComponents/foundations/Icons";

import { getFieldsRequiringAttentionCount, plantsToNoCountRows } from "../utils/detailUtils";
import GalleryEntryItem from "./GalleryEntryItem";

const MEDIA_EXTENSIONS = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "mp4", "mov", "avi", "webm", "mkv"]);

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
};

type EntryValueRendererProps = {
  entry: FormEntry;
  noGoalTableColumns: { key: string; label: string }[];
  entityName: "projects" | "sites";
  entityUUID: string;
};

const EntryValueRenderer = ({ entry, noGoalTableColumns, entityName, entityUUID }: EntryValueRendererProps) => {
  const rawValue = entry.value ?? "-";

  if (entry.title === "Photos and videos") {
    const images = parseFilesFromHtml(typeof rawValue === "string" ? rawValue : "");

    if (images.length === 0) {
      return (
        <Text textStyle="400" color="neutral.900">
          -
        </Text>
      );
    }

    return (
      <Grid templateColumns="repeat(4, minmax(0, 1fr))" gap={2}>
        {images.map(file => (
          <GalleryEntryItem
            key={file.fileUrl}
            src={file.fileUrl}
            name={file.fileType ? `${file.fileName}.${file.fileType}` : file.fileName}
            entityName={entityName}
            entityUUID={entityUUID}
          />
        ))}
      </Grid>
    );
  }
  if (
    entry.title ===
      "If you have any additional documentation on your site you would like to share, please add it below." ||
    entry.title === "Additional Documentation"
  ) {
    const files = parseFilesFromHtml(typeof rawValue === "string" ? rawValue : "");

    if (files.length === 0) {
      return (
        <Text textStyle="400" color="neutral.900">
          -
        </Text>
      );
    }

    const mediaFiles = files.filter(f => MEDIA_EXTENSIONS.has(f.fileType.toLowerCase()));
    const documentFiles = files.filter(f => !MEDIA_EXTENSIONS.has(f.fileType.toLowerCase()));

    return (
      <>
        {mediaFiles.length > 0 && (
          <Grid templateColumns="repeat(4, minmax(0, 1fr))" gap={2}>
            {mediaFiles.map((file: ParsedFile) => (
              <GalleryEntryItem
                key={file.fileUrl}
                src={file.fileUrl}
                name={file.fileType ? `${file.fileName}.${file.fileType}` : file.fileName}
                entityName={entityName}
                entityUUID={entityUUID}
              />
            ))}
          </Grid>
        )}
        {documentFiles.length > 0 && (
          <Grid templateColumns="repeat(2, minmax(0, 1fr))" gap={4}>
            {documentFiles.map((file: ParsedFile) => (
              <AttachFileItem
                key={file.fileUrl}
                fileName={file.fileName}
                onClick={() => window.open(file.fileUrl, "_blank")}
                fileType={file.fileType}
              />
            ))}
          </Grid>
        )}
      </>
    );
  }

  if (typeof rawValue === "string" || typeof rawValue === "number") {
    return (
      <Text textStyle="400" color="neutral.900" dangerouslySetInnerHTML={{ __html: formatEntryValue(rawValue) }} />
    );
  }

  if (rawValue.props.tableType === "noCount") {
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
        className={classNames("mt-[2px]", dataPlants.length <= NO_COUNT_TABLE_SPECIES_PER_PAGE && "mb-3")}
        renderRow={rowData => {
          const row = rowData as Record<number, string> & { id: number };
          return (
            <TableRow>
              {noCountTableColumns.map((col, idx) => (
                <TableCell key={col.key + idx} className={idx === 0 ? undefined : "px-0! py-4"}>
                  {row[idx + 1] !== undefined && row[idx + 1] !== "" && (
                    <Box
                      className={classNames(
                        "border-theme-neutral-300 border-b py-4",
                        idx === noCountTableColumns.length - 1 ? "" : "mr-8"
                      )}
                    >
                      {row[idx + 1]}
                    </Box>
                  )}
                </TableCell>
              ))}
            </TableRow>
          );
        }}
      />
    );
  }

  if (rawValue.props.tableType === "noGoal") {
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
          rawValue.props.plants.length <= COUNT_TABLE_SPECIES_PER_PAGE_MIN && "mb-3"
        )}
      />
    );
  }

  return (
    <Text textStyle="400" color="neutral.900">
      {formatEntryValue(rawValue)}
    </Text>
  );
};

const SharedDetails: FC<SharedDetailsProps> = ({
  step,
  formValues,
  entityName,
  entityUUID,
  entityStatus,
  updateRequestStatus,
  stepIndex,
  entity
}) => {
  const t = useT();
  const router = useRouter();

  const isValid = step.validation.isValidSync(formValues);
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

  const noGoalTableColumns = useMemo(
    () => [
      { key: "name", label: t("Species Name") },
      { key: "amount", label: t("Number of Trees Expected") }
    ],
    [t]
  );

  return entries.length === 0 ? null : (
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
          const isAdditionalInformation =
            entry.title === "Additional Information" || entry.title === "Tree Species - Additional Information";
          return (
            <Fragment key={`${step.id}-${entry.title}-${index}`}>
              <Flex direction="column" gap={1}>
                <Text
                  display="flex"
                  alignItems="center"
                  gap={1}
                  lineHeight={"normal"}
                  textStyle={isAdditionalInformation ? "400" : "300-bold"}
                  color={isAdditionalInformation ? "neutral.700" : "primary.900"}
                >
                  {entry.title === "Photos and videos" ? <PhotosIcon boxSize={3.5} color="primary.900" /> : null}
                  {t(entry.title === "Photos and videos" ? "Photos" : entry.title)}
                  {!isAdditionalInformation && entry.title !== "Photos and videos" && ":"}
                </Text>
                <div
                  className={classNames("bg-theme-neutral-300 my-2 h-px w-full", !isAdditionalInformation && "hidden")}
                />
                <EntryValueRenderer
                  entry={entry}
                  noGoalTableColumns={noGoalTableColumns}
                  entityName={entityName}
                  entityUUID={entityUUID}
                />
              </Flex>
              {stepIndex === 0 && index === 0 && entityName === "projects" && (
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
                            <ArrowForward boxSize={4} color="neutral.900" />
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
              )}
            </Fragment>
          );
        })}
      </Flex>
    </Accordion>
  );
};

export default SharedDetails;
