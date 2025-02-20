import { IconNames } from "@/components/extensive/Icon/Icon";

export interface DropdownVariant {
  containerClassName?: string;
  className: string;
  iconClassName?: string;
  titleContainerClassName: string;
  titleClassname?: string;
  iconName?: IconNames;
  iconNameClear?: IconNames;
  iconClearContainerClassName?: string;
  iconClearClassName?: string;
  optionsClassName?: string;
  optionCheckboxClassName?: string;
  optionLabelClassName?: string;
  optionClassName?: string;
}

export const VARIANT_DROPDOWN_DEFAULT: DropdownVariant = {
  containerClassName: "",
  className: "border-light",
  iconClassName: "w-4",
  iconName: undefined,
  titleContainerClassName: "flex items-center gap-2",
  titleClassname: "",
  optionCheckboxClassName: "",
  optionLabelClassName: ""
};

export const VARIANT_DROPDOWN_HEADER: DropdownVariant = {
  containerClassName: "relative",
  className: "gap-2 text-white",
  iconClassName: "w-3 h-[9px] fill-trasparent",
  iconName: IconNames.CHEVRON_DOWN_DASH,
  iconNameClear: IconNames.CLEAR,
  iconClearClassName: "w-3 h-3",
  iconClearContainerClassName: "p-1 border border-neutral-200 rounded",
  titleContainerClassName: "flex-1 overflow-hidden",
  titleClassname: "leading-normal text-ellipsis whitespace-nowrap overflow-hidden",
  optionCheckboxClassName: "checked:text-blueCustom-700",
  optionLabelClassName: "text-14-semibold whitespace-nowrap",
  optionClassName: "gap-2"
};

export const VARIANT_DROPDOWN_FILTER: DropdownVariant = {
  containerClassName: "",
  className: "",
  iconClassName: "w-4 fill-primary",
  iconName: undefined,
  titleContainerClassName: "flex items-center gap-2",
  titleClassname: "",
  optionCheckboxClassName: "",
  optionLabelClassName: "whitespace-nowrap"
};

export const VARIANT_DROPDOWN_SIMPLE: DropdownVariant = {
  className: "gap-2 text-black border-b-2 border-black py-0 px-1 rounded-none h-fit pb-2.5 !h-8",
  iconClassName: "w-3 h-[9px] fill-trasparent",
  iconName: IconNames.CHEVRON_DOWN_DASH,
  iconNameClear: IconNames.CLEAR,
  titleContainerClassName: "flex-1 overflow-hidden",
  titleClassname: "leading-normal text-ellipsis whitespace-nowrap overflow-hidden",
  optionCheckboxClassName: "checked:text-blueCustom-700",
  optionLabelClassName: "text-14-semibold whitespace-nowrap",
  optionClassName: "gap-2"
};

export const VARIANT_DROPDOWN_IMPACT_STORY: DropdownVariant = {
  containerClassName: "relative",
  className: "gap-2 !text-black border border-neutral-200 ",
  iconClassName: "w-3 h-[9px] fill-trasparent",
  iconName: IconNames.CHEVRON_DOWN_DASH,
  iconNameClear: IconNames.CLEAR,
  iconClearClassName: "w-3 h-3",
  iconClearContainerClassName: "p-1 border border-neutral-200 rounded",
  titleContainerClassName: "flex-1 overflow-hidden",
  titleClassname: "leading-normal text-ellipsis whitespace-nowrap overflow-hidden",
  optionCheckboxClassName: "checked:text-blueCustom-700",
  optionLabelClassName: "text-14-semibold whitespace-nowrap",
  optionClassName: "gap-2"
};

export const VARIANT_DROPDOWN_COLLAPSE: DropdownVariant = {
  containerClassName: "",
  className: "",
  iconClassName: "w-4",
  iconClearClassName: "w-4",
  iconName: undefined,
  titleContainerClassName: "flex items-center gap-2",
  titleClassname: "hidden",
  optionsClassName: "static bg-neutral-40 rounded-none",
  optionClassName: "flex-row w-full",
  optionCheckboxClassName: "w-4 h-4",
  optionLabelClassName: "text-14-light"
};
