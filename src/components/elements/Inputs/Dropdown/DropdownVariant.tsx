import { IconNames } from "@/components/extensive/Icon/Icon";

export interface DropdownVariant {
  containerClassName: string;
  className: string;
  iconClassName?: string;
  titleContainerClassName: string;
  titleClassname?: string;
  iconName?: IconNames;
}

export const VARIANT_DROPDOWN_DEFAULT: DropdownVariant = {
  containerClassName: "",
  className: "",
  iconClassName: "w-4",
  iconName: undefined,
  titleContainerClassName: "flex items-center gap-2",
  titleClassname: "line-clamp-1"
};

export const VARIANT_DROPDOWN_HEADER = {
  containerClassName: "relative z-10",
  className: "gap-2 text-white",
  iconClassName: "w-3 h-[9px]",
  iconName: IconNames.CHEVRON_DOWN_DASH,
  titleContainerClassName: "flex-1 overflow-hidden",
  titleClassname: "leading-none text-ellipsis whitespace-nowrap overflow-hidden"
};
