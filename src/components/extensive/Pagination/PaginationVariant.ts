import { TextVariants } from "@/types/common";

export interface VariantPagination {
  VariantPageText: TextVariants;
  VariantPrePageText: TextVariants;
  label?: string;
  value?: string;
  labelText?: string;
  iconContent?: string;
  icon?: string;
  textNumberPagination?: string;
  labelsPagination?: boolean;
  iconPagination?: string;
  iconContentPagination?: string;
  contentPageSelector?: string;
  containerClassName?: string;
  textNumberNoSelected?: string;
  textNumberSelected?: string;
}

export const VARIANT_PAGINATION_DEFAULT: VariantPagination = {
  VariantPageText: "text-16-bold",
  VariantPrePageText: "text-16-bold"
};

export const VARIANT_PAGINATION_TEXT_16: VariantPagination = {
  VariantPageText: "text-16-bold",
  VariantPrePageText: "text-16-bold"
};

export const VARIANT_PAGINATION_DASHBOARD: VariantPagination = {
  VariantPageText: "text-12",
  VariantPrePageText: "text-12-bold",
  label: "order-1 mobile:hidden",
  value: "!w-14 !h-8 lg:!h-9 lg:!w-[68px] order-2 border border-grey-350 bg-white rounded-lg shadow-none",
  labelText: "Rows per page:",
  iconContent: "bg-white",
  icon: "h-3 w-3 mb-0",
  textNumberPagination: "hidden",
  labelsPagination: true,
  iconPagination: "h-3 w-3 !fill-black hover:!fill-primary cursor-pointer",
  iconContentPagination:
    "bg-white !w-8 !h-8 lg:!h-9 lg:!w-9 rounded-lg border border-grey-350 flex items-center justify-center",
  contentPageSelector: "!gap-2 items-center",
  textNumberNoSelected: "!font-bold",
  textNumberSelected: "!font-normal",
  containerClassName: "mobile:justify-center"
};

export const VARIANT_PAGINATION_MONITORED: VariantPagination = {
  VariantPageText: "text-12",
  VariantPrePageText: "text-12-bold",
  label: "order-1",
  value: "!w-14 !h-8 lg:!h-9 lg:!w-[68px] order-2 border border-grey-350 bg-white rounded-lg shadow-none",
  labelText: "Rows per page:",
  iconContent: "bg-white",
  icon: "h-3 w-3 mb-0",
  textNumberPagination: "hidden",
  labelsPagination: true,
  iconPagination: "h-3 w-3 !fill-black hover:!fill-primary cursor-pointer",
  iconContentPagination:
    "bg-white !w-8 !h-8 lg:!h-9 lg:!w-9 rounded-lg border border-grey-350 flex items-center justify-center",
  contentPageSelector: "!gap-2 items-center",
  containerClassName: "!mt-3"
};
