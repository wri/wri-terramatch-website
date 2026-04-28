import { TableCell, TableRow, Text, useBreakpointValue } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useMemo } from "react";

import { Framework, useFrameworkContext } from "@/context/framework.provider";
import { getThemedColor } from "@/lib/theme";
import {
  COUNT_TABLE_SPECIES_PER_PAGE_MIN,
  getNoCountTableColumns,
  NO_COUNT_TABLE_SPECIES_PER_PAGE,
  NO_COUNT_TABLE_SPECIES_PER_ROW_DESKTOP,
  NO_COUNT_TABLE_SPECIES_PER_ROW_MOBILE
} from "@/pages/project/[uuid]/tabs/constants/Detail.constants";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import {
  FULL_WIDTH_TABLE_HEADER_STYLES,
  NO_HEADER_TABLE_WRAPPER_STYLES
} from "@/redesignComponents/dataDisplay/Table/tableStyles";

import { plantsToNoCountRows } from "../utils/detailUtils";

type PlantTableEntryRendererProps = {
  tableType: "noCount" | "noGoal";
  plants: Parameters<typeof plantsToNoCountRows>[0];
};

export const PlantTableEntryRenderer: FC<PlantTableEntryRendererProps> = ({ tableType, plants }) => {
  const { framework } = useFrameworkContext();
  const t = useT();
  const isMobile = useBreakpointValue({ base: true, lg: false }) ?? false;
  const noCountTableSpeciesPerRow = isMobile
    ? NO_COUNT_TABLE_SPECIES_PER_ROW_MOBILE
    : NO_COUNT_TABLE_SPECIES_PER_ROW_DESKTOP;
  const noCountTableColumns = useMemo(
    () => getNoCountTableColumns(noCountTableSpeciesPerRow),
    [noCountTableSpeciesPerRow]
  );

  const noGoalTableColumns = useMemo(
    () => [
      { key: "name", label: t("Species Name") },
      { key: "amount", label: t("Number of Trees") }
    ],
    [t]
  );
  const totalRowName = "__total_row__";
  const totalAmount = useMemo(
    () =>
      plants.reduce((sum, plant) => {
        const plantAmount = (plant as { amount?: number | string }).amount;
        const amount = typeof plantAmount === "number" ? plantAmount : Number(plantAmount ?? 0);
        return sum + (amount ? amount : 0);
      }, 0),
    [plants]
  );
  const noGoalTableData = useMemo(
    () => [
      ...plants,
      {
        name: totalRowName,
        amount: totalAmount
      }
    ],
    [plants, totalAmount]
  );

  if (tableType === "noGoal" || framework === Framework.TF) {
    return (
      <Table
        data={noGoalTableData}
        columns={noGoalTableColumns}
        variant="full-width"
        css={FULL_WIDTH_TABLE_HEADER_STYLES}
        totalItems={plants.length}
        showItemCount={false}
        className={classNames(
          "mt-[0.125rem] !w-full max-w-[45.3125rem]",
          plants.length <= COUNT_TABLE_SPECIES_PER_PAGE_MIN && "mb-3"
        )}
        renderRow={rowData => {
          const row = rowData as { name?: string; amount?: number | string };
          const isTotalRow = row.name === totalRowName;
          const totalRowStyle = isTotalRow
            ? {
                fontWeight: 700,
                color: getThemedColor("neutral", 800)
              }
            : undefined;
          return (
            <TableRow>
              <TableCell>
                <Text textStyle="400" color="neutral.700" style={totalRowStyle}>
                  {isTotalRow ? t("Total") : row.name}
                </Text>
              </TableCell>
              <TableCell>
                <Text textStyle="400" color="neutral.700" style={totalRowStyle}>
                  {row.amount}
                </Text>
              </TableCell>
            </TableRow>
          );
        }}
      />
    );
  }

  if (tableType === "noCount") {
    const noCountTableRowCount = plants.length / noCountTableSpeciesPerRow;
    const dataPlants = plantsToNoCountRows(plants, noCountTableSpeciesPerRow);

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
        className={classNames("mt-[0.125rem]", dataPlants.length <= NO_COUNT_TABLE_SPECIES_PER_PAGE && "mb-3")}
        renderRow={rowData => {
          const row = rowData as Record<number, string> & { id: number };
          return (
            <TableRow>
              {noCountTableColumns.map((col, idx) => (
                <TableCell key={col.key + idx} className={idx === 0 ? undefined : "px-0! py-4"}>
                  {row[idx + 1] !== undefined && row[idx + 1] !== "" && (
                    <Text
                      textStyle="400"
                      className={classNames(
                        "truncate border-b border-theme-neutral-300 py-4",
                        idx === noCountTableColumns.length - 1 ? "" : "mr-8"
                      )}
                      color="neutral.900"
                    >
                      {row[idx + 1]}
                    </Text>
                  )}
                </TableCell>
              ))}
            </TableRow>
          );
        }}
      />
    );
  }

  return null;
};

export default PlantTableEntryRenderer;
