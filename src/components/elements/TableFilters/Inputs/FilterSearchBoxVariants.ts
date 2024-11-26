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
  iconClassName: "absolute top-[9px] left-4 w-5",
  input:
    "placeholder:text-body-300 text-body-300 w-full rounded-lg border border-neutral-200 py-2 pl-10 pr-4 text-neutral-1000 placeholder:text-neutral-1000"
};

export const FILTER_SEARCH_BOX_AIRTABLE = {
  container: "flex items-center gap-2 rounded-lg py-2 px-3 z-10 relative",
  icon: IconNames.SEARCH_PA,
  iconClassName: "w-5 h-5 text-white",
  input:
    "text-14-light w-full p-0 border-0 placeholder:text-white focus:ring-0 bg-transparent text-white input-dashboard"
};

export const FILTER_SEARCH_MONITORING = {
  container:
    "flex items-center gap-2 rounded-lg py-[3px] lg:py-[5px] lg:h-[34px] wide:h-[37px] px-2.5 z-10 relative h-min border-neutral-200 bg-white border",
  icon: IconNames.SEARCH_PA,
  iconClassName: "w-5 h-5 text-black",
  input: "text-14 w-full p-0 border-0 placeholder:text-black focus:ring-0 bg-transparent text-black"
};
