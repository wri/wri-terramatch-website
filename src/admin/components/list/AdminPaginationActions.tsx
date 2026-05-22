import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { FC, memo } from "react";

import IconButton from "@/components/elements/IconButton/IconButton";
import { IconNames } from "@/components/extensive/Icon/Icon";

const PREFIX = "RaPaginationActions";

const Root = styled("div", {
  name: PREFIX,
  overridesResolver: (props, styles) => styles.root
})(() => ({
  flexShrink: 0,
  marginLeft: 32,
  display: "flex",
  alignItems: "center",
  gap: 8,
  minWidth: 184
}));

export interface AdminPaginationActionsProps {
  page: number;
  rowsPerPage: number;
  count: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | React.SyntheticEvent | null, page: number) => void;
  className?: string;
}

/**
 * Fixed-layout pagination actions: "Page N of M" plus prev/next controls.
 * Uses shared Icon assets so the toolbar width stays stable while navigating.
 */
export const AdminPaginationActions: FC<AdminPaginationActionsProps> = memo(props => {
  const { page, rowsPerPage, count, onPageChange, className } = props;

  const nbPages = Math.ceil(count / rowsPerPage) || 1;
  const safePage = Math.min(page, Math.max(0, nbPages - 1));
  const currentPage = safePage + 1;

  return (
    <Root className={className}>
      <span className="AdminPagination-currentPageWrap">
        <span className="AdminPagination-pageLabel">Page</span>
        <span className="AdminPagination-pageNumber">{currentPage}</span>
        <span className="AdminPagination-ofTotal">{`of ${nbPages}`}</span>
      </span>
      <span className="AdminPagination-navButtons">
        <IconButton
          type="button"
          className="AdminPagination-navButton"
          disabled={currentPage <= 1}
          onClick={event => onPageChange(event, safePage - 1)}
          aria-label="Go to previous page"
          iconProps={{
            name: IconNames.CHEVRON_LEFT,
            width: 12,
            className: "h-3 w-3 fill-black"
          }}
        />
        <IconButton
          type="button"
          className="AdminPagination-navButton"
          disabled={currentPage >= nbPages}
          onClick={event => onPageChange(event, safePage + 1)}
          aria-label="Go to next page"
          iconProps={{
            name: IconNames.CHEVRON_RIGHT,
            width: 12,
            className: "h-3 w-3 fill-black"
          }}
        />
      </span>
    </Root>
  );
});

AdminPaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  className: PropTypes.string
};
