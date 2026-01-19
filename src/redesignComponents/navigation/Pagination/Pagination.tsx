import { Pagination as PaginationWri } from "@worldresources/wri-design-systems";
import { ComponentProps } from "react";

export type PaginationProps = ComponentProps<typeof PaginationWri>;

const Pagination = (props: PaginationProps) => {
  return <PaginationWri {...props} />;
};

export default Pagination;
