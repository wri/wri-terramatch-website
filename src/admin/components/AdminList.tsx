import { FC } from "react";
import { List as RaList, ListProps, Pagination } from "react-admin";

import { AdminPaginationActions } from "@/admin/components/list/AdminPaginationActions";

const adminDefaultPagination = <Pagination actions={AdminPaginationActions} />;

/**
 * react-admin's {@link Pagination} always sets `TablePagination`'s `ActionsComponent`
 * to the built-in actions, so theme `MuiTablePagination.defaultProps` is ignored.
 * This List defaults to pagination that uses {@link AdminPaginationActions}.
 */
export const List: FC<ListProps> = ({ pagination, ...rest }) => (
  <RaList pagination={pagination === undefined ? adminDefaultPagination : pagination} {...rest} />
);
