import { TextVariants } from "@/types/common";

export interface SecundaryTabsVariants {
  classNameContentList?: string;
  listClassName?: string;
  itemTabClassName?: string;
  selectedTabClassName?: string;
  textVariantSelected: TextVariants;
  textVariantNotSelected: TextVariants;
}

export const VARIANT_TABS_PRIMARY: SecundaryTabsVariants = {
  classNameContentList: "border-b-2 border-neutral-200 bg-white",
  listClassName: "m-auto",
  itemTabClassName: " px-4 py-4 border-b-[3px] text-black",
  selectedTabClassName: "border-primary",
  textVariantSelected: "text-16-bold",
  textVariantNotSelected: "text-16-light"
};

export const VARIANT_TABS_ABOUT_US: SecundaryTabsVariants = {
  classNameContentList: "border-b-2 border-neutral-200 bg-white mobile:overflow-scroll mobile:border-none",
  listClassName: "grid grid-cols-5 gap-4 mobile:flex mobile:w-full mobile:gap-0",
  itemTabClassName: " px-2 py-5 text-center border-b-4 text-neutral-700 mobile:w-full mobile:min-w-full mobile:p-0",
  selectedTabClassName: "border-black !text-black mobile:border-none",
  textVariantSelected: "text-18",
  textVariantNotSelected: "text-18"
};

export const VARIANT_TABS_IMPACT_STORY: SecundaryTabsVariants = {
  classNameContentList: " bg-transparent overflow-scroll mobile:overflow-scroll mobile:border-none",
  listClassName:
    "flex gap-4 overflow-scroll w-max border-b-2 border-neutral-200 !overflow-visible mobile:w-full mobile:gap-0 mobile:border-none",
  itemTabClassName:
    "px-7 py-2 lg:py-3 text-center border-b-4 !mb-[-1.5px] text-neutral-700 bg-transparent overflow-visible z-10 mobile:p-0 mobile:w-full mobile:min-w-full",
  selectedTabClassName: "border-black !text-black mobile:border-none",
  textVariantSelected: "text-18",
  textVariantNotSelected: "text-18"
};
