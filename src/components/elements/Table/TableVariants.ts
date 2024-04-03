export interface TableVariant {
  name: string;
  trHeader: string;
  trBody: string;
  tdBody?: string;
  thHeader?: string;
}

export const VARIANT_TABLE_PRIMARY = {
  name: "primary",
  trHeader: "bg-white shadow",
  trBody: "border-2 border-neutral-200"
};

export const VARIANT_TABLE_SECONDARY = {
  name: "secondary",
  trHeader: "bg-neutral-50",
  trBody: "bg-neutral-50"
};

export const VARIANT_TABLE_SECONDARY_WHITE = {
  name: "secondary-white",
  trHeader: "bg-neutral-50",
  trBody: "bg-white"
};

export const VARIANT_TABLE_BORDER = {
  name: "border",
  trHeader: "border-neutral-200 border bg-blueCustom-50",
  trBody: "bg-white border",
  tdBody: "border-neutral-200 border text-16-light",
  thHeader: "border-neutral-200 border"
};

export const VARIANT_TABLE_BORDER_ALL = {
  name: "border-all",
  trHeader: "border-neutral-200 border bg-blueCustom-100",
  trBody: "bg-white ",
  tdBody: "border-neutral-200 border-t border-b first:border-l last:border-r text-14-light",
  thHeader: "border-neutral-200 text-16-bold"
};
