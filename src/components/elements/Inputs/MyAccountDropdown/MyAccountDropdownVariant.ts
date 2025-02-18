import { IconNames } from "@/components/extensive/Icon/Icon";

export interface MyAccountDropdownVariant {
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
}

export const VARIANT_MY_ACCOUNT_DROPDOWN: MyAccountDropdownVariant = {
  classIcon: "mr-2 text-neutral-700",
  classButtonPopover: "flex items-center justify-between p-2",
  classText: "text-14-light mr-2 whitespace-nowrap text-sm uppercase text-darkCustom",
  icon: IconNames.MY_ACCOUNT,
  arrowIcon: IconNames.TRIANGLE_DOWN,
  arrowDashboardClass: "hidden",
  arrowNavbarClass: "transition fill-neutral-700 ui-open:rotate-180 ui-open:transform",
  classPanel: "border-1 absolute right-0 z-50 mt-4 w-auto  border border-neutral-300 bg-white shadow",
  classList: "",
  classItem:
    "px-3 py-1 text-neutral-900 first:pt-2  last:pb-2 hover:bg-neutral-200 whitespace-nowrap flex items-center gap-2",
  classIconSelected: "w-3 h-3",
  classContent: "relative w-fit",
  classContentOpen: ""
};

export const VARIANT_MY_ACCOUNT_DROPDOWN_SECONDARY: MyAccountDropdownVariant = {
  classIcon: "text-white w-8 h-8",
  classButtonPopover: "flex flex-col items-start outline-none opacity-50 aria-expanded:opacity-100",
  classText: "hidden",
  icon: IconNames.IC_USER,
  arrowIcon: IconNames.CHEVRON_DOWN,
  arrowDashboardClass: "transition fill-white ui-open:rotate-180 ui-open:transform h-2.5 w-2.5 min-w-2.5",
  arrowNavbarClass: "hidden",
  classPanel: "border-1 absolute bottom-0 left-full z-50 ml-4 w-auto bg-white shadow rounded-lg overflow-hidden",
  classList: "divide-y divide-grey-950",
  classItem:
    "py-2 px-3 hover:bg-neutral-200 text-black !font-normal flex items-center gap-2 whitespace-nowrap cursor-pointer",
  classIconSelected: "w-3 h-3",
  classContent: "relative w-fit",
  classContentOpen: "!opacity-100"
};
