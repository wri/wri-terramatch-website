import { Box, TableCell, TableRow } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useMemo } from "react";

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

import { plantsToNoCountRows } from "../utils/detailUtils";

export type PlantTableRawValue = {
  props: {
    tableType: "noCount" | "noGoal";
    plants: Parameters<typeof plantsToNoCountRows>[0];
  };
};

type PlantTableEntryRendererProps = {
  rawValue: PlantTableRawValue;
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
                        "border-theme-neutral-300 truncate border-b py-4",
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

export default PlantTableEntryRenderer;
