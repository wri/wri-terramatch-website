import { Box } from "@chakra-ui/react";
import { Pagination as WriPagination } from "@worldresources/wri-design-systems";
import { FC } from "react";

import { paginationButtonStyles } from "./paginationStyles";

export type PaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  variant?: "default" | "compact" | "compact-with-buttons";
  onPageChange?: (page: number) => void;
};

const Pagination: FC<PaginationProps> = ({ currentPage, totalItems, pageSize, variant, onPageChange }) => {
  return (
    <Box css={paginationButtonStyles}>
      <WriPagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        variant={variant}
        onPageChange={onPageChange}
      />
    </Box>
  );
};

export default Pagination;
