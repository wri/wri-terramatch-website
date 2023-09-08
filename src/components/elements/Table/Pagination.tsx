import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import Button from "@/components/elements/Button/Button";
import IconButton from "@/components/elements/IconButton/IconButton";
import { IconNames } from "@/components/extensive/Icon/Icon";

export interface PaginationProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  pageIndex: number;

  nextPage: () => void;
  getCanNextPage: () => boolean;

  previousPage: () => void;
  getCanPreviousPage: () => boolean;

  getPageCount: () => number;
  setPageIndex: (index: number) => void;
}

function Pagination({
  nextPage,
  getCanNextPage,
  getPageCount,
  setPageIndex,
  previousPage,
  getCanPreviousPage,
  pageIndex,
  className,
  ...props
}: PaginationProps) {
  const currentPage = pageIndex + 1;

  if (getPageCount() > 1)
    return (
      <div {...props} className={classNames(className, "flex gap-5")}>
        <IconButton
          iconProps={{ name: IconNames.CHEVRON_LEFT, className: "fill-primary", width: 24 }}
          onClick={() => previousPage()}
          disabled={!getCanPreviousPage()}
        />
        {getPaginationItems(currentPage, getPageCount()).map(pageNumber => {
          return (
            <Button
              key={pageNumber}
              variant="text"
              className={classNames(currentPage === pageNumber ? "text-neutral-1000" : "text-neutral-700")}
              disabled={typeof pageNumber !== "number"}
              onClick={() => typeof pageNumber === "number" && setPageIndex(pageNumber - 1)}
            >
              {pageNumber}
            </Button>
          );
        })}
        <IconButton
          iconProps={{ name: IconNames.CHEVRON_RIGHT, className: "fill-primary", width: 24 }}
          onClick={() => nextPage()}
          disabled={!getCanNextPage()}
        />
      </div>
    );
  else return null;
}

function getPaginationItems(current: number, max: number) {
  if (!current || !max) return [];

  const items: (string | number)[] = [1];

  if (current === 1 && max === 1) return items;
  if (current > 4) items.push("...");

  let r = 2;
  let r1 = current - r;
  let r2 = current + r;

  for (let i = r1 > 2 ? r1 : 2; i <= Math.min(max, r2); i++) items.push(i);

  if (r2 + 1 < max) items.push("...");
  if (r2 < max) items.push(max);

  return items;
}

export default Pagination;
