export interface WorkdayGridVariantProps {
  header: string;
  open?: string;
  bodyCollapse: string;
  columTitle: string;
  gridStyle: string;
  roundedTl: string;
  roundedBl: string;
  roundedTr: string;
  roundedBr: string;
  firstCol?: string;
  secondCol?: string;
  tertiaryCol?: string;
  totalIcon?: string;
}

export const GRID_VARIANT_DEFAULT = {
  header: "rounded bg-neutral-350",
  bodyCollapse: "bg-transparent pt-4 pr-11",
  columTitle: "bg-neutral-10",
  gridStyle: "rounded grid-cols-23",
  roundedTl: "rounded-tl",
  roundedBl: "rounded-bl",
  roundedTr: "rounded-tr",
  roundedBr: "rounded-br",
  firstCol: "col-span-8",
  secondCol: "col-span-7 bg-white",
  tertiaryCol: "col-span-8",
  totalIcon: "hidden"
};

export const GRID_VARIANT_GREEN = {
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
  tertiaryCol: "col-span-4",
  totalIcon: "text-customGreen-200"
};
