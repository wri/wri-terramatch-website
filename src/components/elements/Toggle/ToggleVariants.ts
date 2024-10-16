export interface ToggleVariants {
  container: string;
  activeToggle: string;
  textActive: string;
  textInactive: string;
  heightBtn: number;
}

export const VARIANT_TOGGLE_PRIMARY = {
  container: "rounded-lg bg-neutral-40 p-1",
  activeToggle: "rounded-lg bg-white h-[calc(100%_-_8px)]",
  textActive: "text-14-bold text-darkCustom",
  textInactive: "text-14-bold text-darkCustom-60",
  heightBtn: 8
};

export const VARIANT_TOGGLE_DASHBOARD = {
  container: "bg-white border-b border-grey-1000 p-0",
  activeToggle: "uppercase bg-transparent border-b-2 border-blueCustom-700 h-[calc(100%_-_2px)] left-1",
  textActive: "text-12-bold text-blueCustom-700 pb-1 uppercase",
  textInactive: "text-12-light text-darkCustom-40 pb-1 uppercase",
  heightBtn: 2
};
