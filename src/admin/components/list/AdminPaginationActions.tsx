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
 * Custom PaginationActions: always renders "Page N of M" via explicit markup so spacing
 * stays consistent on every page (no CSS ::before/::after pseudo-labels).
 */
export const AdminPaginationActions: FC<AdminPaginationActionsProps> = memo(props => {
  const { page, rowsPerPage, count, onPageChange, size = "small", className, ...rest } = props;
  const translate = useTranslate();

  const nbPages = Math.ceil(count / rowsPerPage) || 1;
  const safePage = Math.min(page, Math.max(0, nbPages - 1));

  const renderItem = useCallback(
    (item: PaginationRenderItemParams) => {
      if (item.type === "page") {
        if (item.selected) {
          return (
            <span className="AdminPagination-currentPageWrap">
              <span className="AdminPagination-pageLabel">Page</span>
              <PaginationItem {...item} />
              <span className="AdminPagination-ofTotal">{`of ${nbPages}`}</span>
            </span>
          );
        }

        return null;
      }

      return <PaginationItem {...item} />;
    },
    [nbPages]
  );

  if (nbPages === 1) {
    return <Root className={className} />;
  }

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
        page={safePage + 1}
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
