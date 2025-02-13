import { IconNames } from "@/components/extensive/Icon/Icon";

export interface LanguagesDropdownVariant {
  classIcon: string;
  classButtonPopover?: string;
  classText: string;
  icon: IconNames;
  arrowIcon: IconNames;
  arrowDashboardClass: string;
  arrowNavbarClass: string;
  classPanel: string;
  classList: string;
  classItem: string;
  classIconSelected: string;
  classContent: string;
  classContentOpen: string;
  classTextDashboard: string;
}

export const VARIANT_LANGUAGES_DROPDOWN: LanguagesDropdownVariant = {
  classIcon: "mr-2 fill-neutral-700",
  classButtonPopover: "flex items-center justify-between p-2",
  classText: "text-14-light mr-2 whitespace-nowrap text-sm uppercase text-darkCustom",
  icon: IconNames.EARTH,
  arrowIcon: IconNames.TRIANGLE_DOWN,
  arrowDashboardClass: "hidden",
  arrowNavbarClass: "transition fill-neutral-700 ui-open:rotate-180 ui-open:transform",
  classPanel: "border-1 absolute right-0 z-50 mt-4 w-[130px]  border border-neutral-300 bg-white shadow",
  classList: "",
  classItem: "px-3 py-1 uppercase text-neutral-900 first:pt-2  last:pb-2 hover:bg-neutral-200",
  classIconSelected: "hidden",
  classContent: "relative w-fit",
  classContentOpen: "",
  classTextDashboard: "hidden"
};

export const VARIANT_LANGUAGES_DROPDOWN_SECONDARY: LanguagesDropdownVariant = {
  classIcon: "text-white w-8 h-8 mobile:hidden",
  classButtonPopover: "flex flex-col items-start outline-none  opacity-50 aria-expanded:opacity-100",
  classText: "hidden",
  icon: IconNames.EARTH_DASHBOARD,
  arrowIcon: IconNames.CHEVRON_DOWN,
  arrowDashboardClass:
    "transition fill-white ui-open:rotate-180 ui-open:transform h-2.5 w-2.5 min-w-2.5 mt-3 mobile:m-0",
  arrowNavbarClass: "hidden",
  classPanel:
    "shadow-all border-1 absolute sm:bottom-0 sm:left-full z-50 ml-3 w-[140px] bg-white shadow rounded-lg overflow-hidden mobile:top-full mobile:w-auto mobile:left-0 mobile:m-0 mobile:mt-2",
  classList: "divide-y divide-grey-950",
  classItem: "py-2 px-3 hover:bg-neutral-200 text-black !font-normal flex items-center gap-2 cursor-pointer",
  classIconSelected: "text-black",
  classContent:
    "relative w-fit mobile:px-1.5 mobile:py-0.5 mobile:bg-white mobile:bg-opacity-20 mobile:border mobile:border-white mobile:rounded-lg mobile:border-opacity-40",
  classContentOpen: "!opacity-100",
  classTextDashboard: "text-12 whitespace-nowrap uppercase text-white "
};
