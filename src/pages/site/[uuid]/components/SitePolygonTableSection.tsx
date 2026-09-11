import { type SystemStyleObject, Box } from "@chakra-ui/react";
import type { FC, RefObject } from "react";
import { useMemo } from "react";

import LoadingTable from "@/redesignComponents/dataDisplay/Table/components/LoadingTable";
import Table, { type TableColumn } from "@/redesignComponents/dataDisplay/Table/Table";
import type { SortColumn } from "@/redesignComponents/dataDisplay/Table/tableUtils";

import { PolygonTableInteractionActionsProvider } from "./polygonTableInteractionContext";
import type { PolygonTableRow } from "./PolygonTableRow";
import { renderPolygonTableRow } from "./PolygonTableRowConnected";

type SitePolygonTableSectionProps = {
  tableContainerRef: RefObject<HTMLDivElement>;
  tableScrollContainerRef?: RefObject<HTMLDivElement>;
  tableStyles?: SystemStyleObject;
  isSitePolygonsLoading: boolean;
  polygonRows: PolygonTableRow[];
  columns: TableColumn[];
  selectedRows: PolygonTableRow[];
  loadingLabel: string;
  onAllItemsSelected: (checked: boolean, visibleRows: PolygonTableRow[]) => void;
  onClearHover: () => void;
  onRowSelected: (row: PolygonTableRow, selected: boolean) => void;
  readOnly?: boolean;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (sortColumn: SortColumn) => void;
};

const SitePolygonTableSection: FC<SitePolygonTableSectionProps> = ({
  tableContainerRef,
  tableScrollContainerRef,
  tableStyles,
  isSitePolygonsLoading,
  polygonRows,
  columns,
  selectedRows,
  loadingLabel,
  onAllItemsSelected,
  onClearHover,
  onRowSelected,
  readOnly = false,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSortChange
}) => {
  const renderRow = useMemo(() => renderPolygonTableRow(readOnly), [readOnly]);
  const handleAllItemsSelected = readOnly ? () => undefined : onAllItemsSelected;
  const handleRowSelected = readOnly ? () => undefined : onRowSelected;

  return (
    <PolygonTableInteractionActionsProvider onSelectChange={handleRowSelected}>
      <Box onMouseLeave={onClearHover} position="relative" width="100%" maxWidth="100%" minWidth={0}>
        <Table<PolygonTableRow>
          css={tableStyles}
          containerRef={tableContainerRef}
          scrollContainerRef={tableScrollContainerRef}
          data={isSitePolygonsLoading ? [] : polygonRows}
          columns={columns}
          showPagination
          pageSize={pageSize}
          totalItems={totalItems}
          currentPage={currentPage}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          onSortChange={onSortChange}
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
