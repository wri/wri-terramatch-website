export interface TableVariant {
  name: string;
  trHeader: string;
  trBody: string;
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
  name: "secondary",
  trHeader: "bg-neutral-50",
  trBody: "bg-white"
};

export const VARIANT_TABLE_BORDER = "border";
