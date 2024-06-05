import { TextVariants } from "@/types/common";

export interface VariantPagination {
  VariantPageText: TextVariants;
  VariantPrePageText: TextVariants;
}

export const VARIANT_PAGINATION_DEFAULT: VariantPagination = {
  VariantPageText: "text-16-bold",
  VariantPrePageText: "text-16-bold"
};

export const VARIANT_PAGINATION_TEXT_16: VariantPagination = {
  VariantPageText: "text-16-bold",
  VariantPrePageText: "text-16-bold"
};
