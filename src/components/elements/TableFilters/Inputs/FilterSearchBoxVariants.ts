import { IconNames } from "@/components/extensive/Icon/Icon";

export interface FilterSearchBoxVariant {
  container?: string;
  icon: IconNames;
  iconClassName: string;
  input?: string;
}

export const FILTER_SEARCH_BOX_DEFAULT = {
  container: "relative",
  icon: IconNames.SEARCH,
  iconClassName: "absolute top-[11px] left-4 w-5",
  input:
    "placeholder:text-body-300 text-body-300 w-full rounded-lg border border-neutral-200 py-2 pl-10 pr-4 text-neutral-1000 placeholder:text-neutral-1000"
};

export const FILTER_SEARCH_BOX_AIRTABLE = {
  container: "flex items-center gap-2 rounded-lg border border-neutral-200 py-3 px-4",
  icon: IconNames.SEARCH_PA,
  iconClassName: "w-5 h-5 text-darkCustom-100",
  input: "text-14-light w-full p-0 border-0 placeholder:text-darkCustom-100 focus:ring-0"
};
