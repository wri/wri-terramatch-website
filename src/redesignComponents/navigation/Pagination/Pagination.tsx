import { Box } from "@chakra-ui/react";
import { Pagination as WriPagination } from "@worldresources/wri-design-systems";
import { FC } from "react";

export type PaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  variant?: "default" | "compact" | "compact-with-buttons";
  onPageChange?: (page: number) => void;
  className?: string;
};

const Pagination: FC<PaginationProps> = ({ currentPage, totalItems, pageSize, variant, onPageChange, className }) => {
  return (
    <Box className={className}>
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
