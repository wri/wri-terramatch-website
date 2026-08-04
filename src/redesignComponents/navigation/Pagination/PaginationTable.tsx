import { Box } from "@chakra-ui/react";
import { FC } from "react";

import ItemCount from "./ItemCount";
import Pagination from "./Pagination";
import { paginationTableStyles } from "./paginationStyles";

export type PaginationTableProps = {
  pageSize: number;
  currentPage: number;
  totalItems: number;
  onPageSizeChange?: (pageSize: number) => void;
  showItemCountText?: boolean;
  onPageChange?: (page: number) => void;
  variant?: "default" | "compact" | "compact-with-buttons";
};

const PaginationTable: FC<PaginationTableProps> = ({
  pageSize,
  currentPage,
  totalItems,
  onPageSizeChange,
  showItemCountText,
  onPageChange,
  variant
}) => {
  return (
    <Box css={paginationTableStyles} display="flex" alignItems="center" justifyContent="space-between" width="100%">
      <ItemCount
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalItems}
        onPageSizeChange={onPageSizeChange}
        showItemCountText={showItemCountText}
      />
      <Pagination
        totalItems={totalItems}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={onPageChange}
        variant={variant}
        className="flex justify-end"
      />
    </Box>
  );
};

export default PaginationTable;
