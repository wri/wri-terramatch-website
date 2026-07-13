import { Box } from "@chakra-ui/react";
import type { FC, RefObject } from "react";
import { useMemo } from "react";

import LoadingTable from "@/redesignComponents/dataDisplay/Table/components/LoadingTable";
import Table, { type TableColumn } from "@/redesignComponents/dataDisplay/Table/Table";

import { PolygonTableInteractionActionsProvider } from "./polygonTableInteractionContext";
import type { PolygonTableRow } from "./PolygonTableRow";
import { renderPolygonTableRow } from "./PolygonTableRowConnected";
import type { getPolygonsTableStyles } from "./polygonTableStyles";

type SitePolygonTableSectionProps = {
  tableContainerRef: RefObject<HTMLDivElement>;
  tableStyles: ReturnType<typeof getPolygonsTableStyles>;
  isSitePolygonsLoading: boolean;
  polygonRows: PolygonTableRow[];
  columns: TableColumn[];
  selectedRows: PolygonTableRow[];
  loadingLabel: string;
  onAllItemsSelected: (checked: boolean, visibleRows: PolygonTableRow[]) => void;
  onClearHover: () => void;
  onRowSelected: (row: PolygonTableRow, selected: boolean) => void;
  readOnly?: boolean;
};

const SitePolygonTableSection: FC<SitePolygonTableSectionProps> = ({
  tableContainerRef,
  tableStyles,
  isSitePolygonsLoading,
  polygonRows,
  columns,
  selectedRows,
  loadingLabel,
  onAllItemsSelected,
  onClearHover,
  onRowSelected,
  readOnly = false
}) => {
  const renderRow = useMemo(() => renderPolygonTableRow(readOnly), [readOnly]);
  const handleAllItemsSelected = readOnly ? () => undefined : onAllItemsSelected;
  const handleRowSelected = readOnly ? () => undefined : onRowSelected;

  return (
    <PolygonTableInteractionActionsProvider onSelectChange={handleRowSelected}>
      <Box onMouseLeave={onClearHover} position="relative">
        <Table<PolygonTableRow>
          css={tableStyles}
          containerRef={tableContainerRef}
          data={isSitePolygonsLoading ? [] : polygonRows}
          columns={columns}
          showPagination
          pageSize={10}
          selectable
          selectedRows={selectedRows}
          onAllItemsSelected={handleAllItemsSelected}
          renderRow={renderRow}
        />
        {isSitePolygonsLoading && (
          <Box py={20}>
            <LoadingTable text={loadingLabel} />
          </Box>
        )}
      </Box>
    </PolygonTableInteractionActionsProvider>
  );
};

export default SitePolygonTableSection;
