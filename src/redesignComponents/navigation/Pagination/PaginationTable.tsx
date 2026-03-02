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
};

const PaginationTable: FC<PaginationTableProps> = ({
  pageSize,
  currentPage,
  totalItems,
  onPageSizeChange,
  showItemCountText,
  onPageChange
}) => {
  return (
    <Box
      css={paginationTableStyles}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      gap={"12%"}
    >
      <ItemCount
        css={{
          alignItems: "center",
          justifyContent: "center"
        }}
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalItems}
        onPageSizeChange={onPageSizeChange}
        showItemCountText={showItemCountText}
      />
      <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={currentPage} onPageChange={onPageChange} />
    </Box>
  );
};

export default PaginationTable;
