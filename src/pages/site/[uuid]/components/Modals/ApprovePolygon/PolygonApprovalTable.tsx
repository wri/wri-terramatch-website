import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo } from "react";

import ValidationTag from "@/redesignComponents/actions/Tags/ValidationTag/ValidationTag";
import Table, { type TableColumn } from "@/redesignComponents/dataDisplay/Table/Table";
import { AreaHectaresCircleIcon } from "@/redesignComponents/foundations/Icons";
import { formatNumberLocaleString } from "@/utils/dashboardUtils";

import type { PolygonTableRow } from "../../PolygonTableRow";
import { POLYGON_APPROVAL_TABLE_CSS } from "./PolygonApprovalTable.styles";

interface PolygonApprovalTableProps {
  polygons: PolygonTableRow[];
  selectedRows?: PolygonTableRow[];
  onRowSelected?: (row: PolygonTableRow, checked: boolean) => void;
  onAllItemsSelected?: (checked: boolean, visibleRows: PolygonTableRow[]) => void;
  selectable?: boolean;
  showArea?: boolean;
}

const PolygonApprovalTable: FC<PolygonApprovalTableProps> = ({
  polygons,
  selectedRows,
  onRowSelected,
  onAllItemsSelected,
  selectable = true,
  showArea = true
}) => {
  const t = useT();

  const columns = useMemo<TableColumn[]>(() => {
    const baseColumns: TableColumn[] = [
      { key: "polygonName", label: t("Polygon Name") },
      { key: "validation", label: t("Validation") }
    ];
    return showArea ? [...baseColumns, { key: "area", label: t("Total Area") }] : baseColumns;
  }, [showArea, t]);

  // The shared Table always slices its data to one page, even with showPagination={false}.
  // Size the page to the full list so every polygon is rendered and selectable (select-all included).
  const pageSize = Math.max(polygons.length, 1);

  return (
    <Box maxH="20rem" overflowY="auto" maxW="100%">
      <Table
        key={pageSize}
        css={POLYGON_APPROVAL_TABLE_CSS}
        variant="full-width"
        data={polygons}
        pageSize={pageSize}
        showPagination={false}
        showItemCount={false}
        selectable={selectable}
        {...(selectable ? { selectedRows, onRowSelected, onAllItemsSelected } : {})}
        columns={columns}
        renderDataCell={(row, columnKey) => {
          if (columnKey === "validation") {
            return row.validation != null ? <ValidationTag status={row.validation} /> : <Text>—</Text>;
          }
          if (columnKey === "area") {
            return (
              <Flex className="items-center gap-1.5">
                <AreaHectaresCircleIcon boxSize={5} />
                <Text textStyle="400" color="neutral.800">
                  {formatNumberLocaleString(row.area) ?? "—"} ha
                </Text>
              </Flex>
            );
          }
          return (
            <Text textStyle="400" color="neutral.800" maxW="12rem" truncate>
              {row.polygonName ?? "—"}
            </Text>
          );
        }}
      />
    </Box>
  );
};

export default PolygonApprovalTable;
