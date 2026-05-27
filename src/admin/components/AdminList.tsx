import { TablePagination, TablePaginationBaseProps, Theme, Toolbar, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";
import {
  ComponentPropType,
  ListPaginationContextValue,
  sanitizeListRestProps,
  useListPaginationContext,
  useTranslate
} from "ra-core";
import { FC, memo, ReactElement, useCallback, useEffect, useMemo } from "react";
import { List as RaList, ListProps } from "react-admin";

import { AdminPaginationActions } from "@/admin/components/list/AdminPaginationActions";

const DefaultRowsPerPageOptions = [5, 10, 25, 50];
const emptyRowsPerPageOptions: number[] = [];

interface AdminPaginationProps extends TablePaginationBaseProps, Partial<ListPaginationContextValue> {
  rowsPerPageOptions?: number[];
  actions?: FC;
  limit?: ReactElement;
}

/**
 * react-admin Pagination with AdminPaginationActions and page reset when rows-per-page changes.
 * Without resetting page, increasing perPage while on a later page leaves page > totalPages and the list breaks.
 */
const AdminPagination: FC<AdminPaginationProps> = memo(props => {
  const { rowsPerPageOptions = DefaultRowsPerPageOptions, actions, limit = null, ...rest } = props;
  const { isLoading, hasNextPage, page, perPage, total, setPage, setPerPage } = useListPaginationContext(props);
  const translate = useTranslate();
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  const totalPages = useMemo(() => {
    return total != null ? Math.ceil(total / perPage) : undefined;
  }, [perPage, total]);

  const safeDisplayPage = useMemo(() => {
    if (page < 1) {
      return 1;
    }

    if (totalPages != null && totalPages > 0 && page > totalPages) {
      return totalPages;
    }

    return page;
  }, [page, totalPages]);

  useEffect(() => {
    if (total == null || total === 0 || totalPages == null || totalPages < 1) {
      return;
    }

    if (page > totalPages) {
      setPage(1);
    }
  }, [page, total, totalPages, setPage]);

  const handlePageChange = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, nextPage: number) => {
      event?.stopPropagation();

      if (totalPages == null || nextPage < 0 || nextPage > totalPages - 1) {
        return;
      }

      setPage(nextPage + 1);
    },
    [setPage, totalPages]
  );

  const handlePerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPerPage(parseInt(event.target.value, 10));
      setPage(1);
    },
    [setPage, setPerPage]
  );

  const labelDisplayedRows = useCallback(
    ({ from, to, count }: { from: number; to: number; count: number }) =>
      count === -1 && hasNextPage
        ? translate("ra.navigation.partial_page_range_info", {
            offsetBegin: from,
            offsetEnd: to,
            _: `%{from}-%{to} of more than %{to}`
          })
        : translate("ra.navigation.page_range_info", {
            offsetBegin: from,
            offsetEnd: to,
            total: count === -1 ? to : count,
            _: `%{from}-%{to} of %{count === -1 ? to : count}`
          }),
    [hasNextPage, translate]
  );

  const labelItem = useCallback(
    (type: "first" | "last" | "next" | "previous") => translate(`ra.navigation.${type}`, { _: `Go to ${type} page` }),
    [translate]
  );

  if (isLoading) {
    return <Toolbar variant="dense" className="MuiTablePagination-toolbar" />;
  }

  if (total === 0) {
    return limit;
  }

  if (isSmall) {
    return (
      <TablePagination
        count={total == null ? -1 : total}
        rowsPerPage={perPage}
        page={safeDisplayPage - 1}
        onPageChange={handlePageChange}
        rowsPerPageOptions={emptyRowsPerPageOptions}
        component="span"
        labelDisplayedRows={labelDisplayedRows}
        {...sanitizeListRestProps(rest)}
      />
    );
  }

  const ActionsComponent = (actions ?? AdminPaginationActions) as FC;

  return (
    <TablePagination
      count={total == null ? -1 : total}
      rowsPerPage={perPage}
      page={safeDisplayPage - 1}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handlePerPageChange}
      ActionsComponent={ActionsComponent}
      nextIconButtonProps={{
        disabled: !hasNextPage
      }}
      component="span"
      labelRowsPerPage={translate("ra.navigation.page_rows_per_page")}
      labelDisplayedRows={labelDisplayedRows}
      getItemAriaLabel={labelItem}
      rowsPerPageOptions={rowsPerPageOptions}
      {...sanitizeListRestProps(rest)}
    />
  );
});

AdminPagination.propTypes = {
  actions: ComponentPropType,
  limit: PropTypes.element,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number.isRequired)
};

const adminDefaultPagination = <AdminPagination />;

/**
 * react-admin's {@link Pagination} always sets `TablePagination`'s `ActionsComponent`
 * to the built-in actions, so theme `MuiTablePagination.defaultProps` is ignored.
 * This List defaults to custom pagination (AdminPaginationActions + page reset on rows-per-page change).
 */
export const List: FC<ListProps> = ({ pagination, ...rest }) => (
  <RaList pagination={pagination === undefined ? adminDefaultPagination : pagination} {...rest} />
);
