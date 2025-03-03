import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { When } from "react-if";

import IconButton from "@/components/elements/IconButton/IconButton";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { TextVariants } from "@/types/common";

import { VariantPagination } from "./PaginationVariant";

export interface PageSelectorProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  pageIndex: number;
  variantText?: TextVariants;

  nextPage: () => void;
  getCanNextPage: () => boolean;

  previousPage: () => void;
  getCanPreviousPage: () => boolean;

  getPageCount: () => number;
  setPageIndex: (index: number) => void;

  variant?: VariantPagination;
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
  variant,
  ...props
}: PageSelectorProps) {
  const currentPage = pageIndex + 1;
  const t = useT();

  return (
    <div
      {...props}
      className={classNames(className, "flex items-center justify-center gap-5", variant?.contentPageSelector)}
    >
      <When condition={variant?.labelsPagination ?? false}>
        <Text variant={"text-12-semibold"} className={classNames("text-black mobile:order-2")}>
          {t("Page")}
        </Text>
        <Text
          variant={"text-12-semibold"}
          className={classNames(
            "text-black mobile:order-3 mobile:!w-fit mobile:border-none mobile:bg-transparent mobile:p-0",
            variant?.iconContentPagination
          )}
        >
          {currentPage}
        </Text>
        <Text variant={"text-12-semibold"} className={classNames("text-black mobile:order-4")}>
          {t("of")} {getPageCount()}
        </Text>
      </When>
      <IconButton
        iconProps={{
          name: IconNames.CHEVRON_LEFT,
          className: classNames("fill-primary", variant?.iconPagination),
          width: 20
        }}
        onClick={() => previousPage()}
        disabled={!getCanPreviousPage()}
        className={classNames(variant?.iconContentPagination, "mobile:order-1")}
      />
      {getPaginationItems(currentPage, getPageCount()).map(pageNumber => {
        return (
          <Text
            key={pageNumber}
            role="button"
            variant={variantText ?? "text-bold-subtitle-500"}
            className={classNames(
              currentPage === pageNumber ? "text-neutral-1000 underline" : "text-neutral-600",
              variant?.textNumberPagination
            )}
            disabled={typeof pageNumber !== "number"}
            onClick={() => typeof pageNumber === "number" && setPageIndex(pageNumber - 1)}
          >
            {pageNumber}
          </Text>
        );
      })}
      <IconButton
        iconProps={{
          name: IconNames.CHEVRON_RIGHT,
          className: classNames("fill-primary", variant?.iconPagination),
          width: 20
        }}
        onClick={() => nextPage()}
        disabled={!getCanNextPage()}
        className={classNames(variant?.iconContentPagination, "mobile:order-5")}
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
