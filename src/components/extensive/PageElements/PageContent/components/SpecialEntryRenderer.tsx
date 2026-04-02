import { Box, TableCell, TableRow } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useMemo } from "react";

import { FormEntry } from "@/components/extensive/WizardForm/FormSummaryRow/types";
import {
  COUNT_TABLE_SPECIES_PER_PAGE_MIN,
  NO_COUNT_TABLE_SPECIES_PER_PAGE,
  NO_COUNT_TABLE_SPECIES_PER_ROW,
  noCountTableColumns
} from "@/pages/project/[uuid]/tabs/constants/Detail.constants";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import {
  FULL_WIDTH_TABLE_HEADER_STYLES,
  NO_HEADER_TABLE_WRAPPER_STYLES
} from "@/redesignComponents/dataDisplay/Table/tableStyles";
import { EntityName, SingularEntityName } from "@/types/common";

import { plantsToNoCountRows } from "../utils/detailUtils";
import AdditionalDocumentationSection from "./AdditionalDocumentationSection";
import PhotosAndVideosSection from "./PhotosAndVideosSection";

export const SPECIAL_ENTRY_TITLES = new Set([
  "Photos and videos",
  "Additional Documentation",
  "If you have any additional documentation on your site you would like to share, please add it below."
]);

type PlantTableRawValue = {
  props: {
    tableType: "noCount" | "noGoal";
    plants: Parameters<typeof plantsToNoCountRows>[0];
  };
};

type PlantTableEntryRendererProps = {
  rawValue: PlantTableRawValue;
  entityName?: "projects" | "sites";
};

export const PlantTableEntryRenderer: FC<PlantTableEntryRendererProps> = ({ rawValue }) => {
  const t = useT();
  const noGoalTableColumns = useMemo(
    () => [
      { key: "name", label: t("Species Name") },
      { key: "amount", label: t("Number of Trees Expected") }
    ],
    [t]
  );

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
                        "border-b border-theme-neutral-300 py-4",
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

  return null;
};

type SpecialEntryRendererProps = {
  entry: FormEntry;
  entityName?: EntityName | SingularEntityName;
  entityUUID?: string;
};

const SpecialEntryRenderer: FC<SpecialEntryRendererProps> = ({ entry, entityName, entityUUID }) => {
  const value = typeof entry.value === "string" ? entry.value : "";

  if (entry.title === "Photos and videos") {
    return <PhotosAndVideosSection value={value} entityName={entityName} entityUUID={entityUUID} />;
  }

  if (entry.inputType === "treeSpecies") {
    const plants = entry.value?.props?.plants;
    if (plants == null || plants.length === 0) {
      return null;
    }
    return <PlantTableEntryRenderer rawValue={{ props: { tableType: "noCount", plants } }} />;
  }

  return <AdditionalDocumentationSection value={value} entityName={entityName} entityUUID={entityUUID} />;
};

export default SpecialEntryRenderer;
