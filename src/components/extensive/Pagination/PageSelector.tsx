import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import IconButton from "@/components/elements/IconButton/IconButton";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { TextVariants } from "@/types/common";

export interface PageSelectorProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  pageIndex: number;
  variantText?: TextVariants;

  nextPage: () => void;
  getCanNextPage: () => boolean;

  previousPage: () => void;
  getCanPreviousPage: () => boolean;

  getPageCount: () => number;
  setPageIndex: (index: number) => void;
}

function PageSelector({
  nextPage,
  getCanNextPage,
  getPageCount,
  setPageIndex,
  previousPage,
  getCanPreviousPage,
  pageIndex,
  className,
  variantText,
  ...props
}: PageSelectorProps) {
  const currentPage = pageIndex + 1;

  return (
    <div {...props} className={classNames(className, "flex items-center justify-center gap-5")}>
      <IconButton
        iconProps={{ name: IconNames.CHEVRON_LEFT, className: "fill-primary", width: 20 }}
        onClick={() => previousPage()}
        disabled={!getCanPreviousPage()}
      />
      {getPaginationItems(currentPage, getPageCount()).map(pageNumber => {
        return (
          <Text
            key={pageNumber}
            role="button"
            variant={variantText ?? "text-bold-subtitle-500"}
            className={classNames(currentPage === pageNumber ? "text-neutral-1000 underline" : "text-neutral-600")}
            disabled={typeof pageNumber !== "number"}
            onClick={() => typeof pageNumber === "number" && setPageIndex(pageNumber - 1)}
          >
            {pageNumber}
          </Text>
        );
      })}
      <IconButton
        iconProps={{ name: IconNames.CHEVRON_RIGHT, className: "fill-primary", width: 20 }}
        onClick={() => nextPage()}
        disabled={!getCanNextPage()}
      />
    </div>
  );
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

export default PageSelector;
