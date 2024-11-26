import { DemographicGridVariantProps } from "./types";

export const GRID_VARIANT_DEFAULT: DemographicGridVariantProps = {
  header: "rounded bg-neutral-350",
  bodyCollapse: "bg-transparent pt-4 pr-11",
  columTitle: "bg-neutral-10",
  gridStyle: "rounded grid-cols-15",
  roundedTl: "rounded-tl",
  roundedBl: "rounded-bl",
  roundedTr: "rounded-tr",
  roundedBr: "rounded-br",
  firstCol: "col-span-4",
  secondCol: "col-span-7 bg-white",
  tertiaryCol: "col-span-4"
};

export const GRID_VARIANT_GREEN: DemographicGridVariantProps = {
  header: "rounded-t-2xl bg-customGreen-100",
  open: "rounded-2xl",
  bodyCollapse: "bg-neutral-75 px-4 py-5",
  columTitle: "bg-neutral-450",
  gridStyle: "rounded-2xl grid-cols-15",
  roundedTl: "rounded-tl-2xl",
  roundedBl: "rounded-bl-2xl",
  roundedTr: "rounded-tr-2xl",
  roundedBr: "rounded-br-2xl",
  firstCol: "col-span-4",
  secondCol: "col-span-7",
  tertiaryCol: "col-span-4"
};

export const GRID_VARIANT_NARROW: DemographicGridVariantProps = {
  header: "rounded bg-neutral-350",
  bodyCollapse: "bg-transparent pt-4",
  columTitle: "bg-neutral-10",
  gridStyle: "rounded grid-cols-10",
  roundedTl: "rounded-tl",
  roundedBl: "rounded-bl",
  roundedTr: "rounded-tr",
  roundedBr: "rounded-br",
  firstCol: "col-span-2",
  secondCol: "col-span-6 bg-white",
  tertiaryCol: "col-span-2"
};
