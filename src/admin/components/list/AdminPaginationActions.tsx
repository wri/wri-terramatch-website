import { Pagination, PaginationItem } from "@mui/material";
import type { PaginationProps, PaginationRenderItemParams } from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useTranslate } from "ra-core";
import * as React from "react";
import { FC, memo, useCallback } from "react";

const PREFIX = "RaPaginationActions";

const Root = styled("div", {
  name: PREFIX,
  overridesResolver: (props, styles) => styles.root
})(() => ({
  flexShrink: 0,
  ml: 4
}));

const sanitizeRestProps = ({ nextIconButtonProps, backIconButtonProps, ...rest }: Record<string, unknown>) => rest;

export interface AdminPaginationActionsProps extends PaginationProps {
  page: number;
  rowsPerPage: number;
  count: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | React.SyntheticEvent | null, page: number) => void;
}

/**
 * Same as ra-ui-materialui PaginationActions. On the last page, the selected item
 * shows an explicit "Page N of M" row (label + page button + suffix) so layout CSS
 * does not strip the prefix or total.
 */
export const AdminPaginationActions: FC<AdminPaginationActionsProps> = memo(props => {
  const { page, rowsPerPage, count, onPageChange, size = "small", className, ...rest } = props;
  const translate = useTranslate();

  const nbPages = Math.ceil(count / rowsPerPage) || 1;

  if (nbPages === 1) {
    return <Root className={className} />;
  }

  const isLastPage = page >= nbPages - 1;

  const renderItem = useCallback(
    (item: PaginationRenderItemParams) => {
      const element = <PaginationItem {...item} />;
      if (item.type === "page" && item.selected && isLastPage) {
        // Full "Page N of M" in one flex row: the legacy ::after "Page" on the button breaks once wrapped.
        return (
          <span className="AdminPagination-currentPageWrap">
            <span className="AdminPagination-pageLabel">Page</span>
            {element}
            <span className="AdminPagination-ofTotal">{` of ${nbPages}`}</span>
          </span>
        );
      }
      return element;
    },
    [isLastPage, nbPages]
  );

  const getItemAriaLabel = (
    type: "page" | "first" | "last" | "next" | "previous",
    pageNum: number,
    selected: boolean
  ) => {
    if (type === "page") {
      return selected
        ? translate("ra.navigation.current_page", {
            page: pageNum,
            _: `page ${pageNum}`
          })
        : translate("ra.navigation.page", {
            page: pageNum,
            _: `Go to page ${pageNum}`
          });
    }
    return translate(`ra.navigation.${type}`, { _: `Go to ${type} page` });
  };

  return (
    <Root className={className}>
      <Pagination
        size={size}
        count={nbPages}
        page={page + 1}
        onChange={(event, p) => onPageChange(event as React.MouseEvent<HTMLButtonElement>, p - 1)}
        {...sanitizeRestProps(rest)}
        getItemAriaLabel={getItemAriaLabel}
        renderItem={renderItem}
      />
    </Root>
  );
});

AdminPaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  color: PropTypes.oneOf(["primary", "secondary", "standard"]),
  size: PropTypes.oneOf(["small", "medium", "large"])
};
