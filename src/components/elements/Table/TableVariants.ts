export interface TableVariant {
  name: string;
  table?: string;
  trHeader: string;
  tBody?: string;
  trBody: string;
  tdBody?: string;
  thHeader?: string;
}

export const VARIANT_TABLE_PRIMARY = {
  table: "border-spacing-y-4 border-separate",
  name: "primary",
  trHeader: "bg-white shadow",
  thHeader: "first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg",
  tBody: "space-y-4",
  trBody: "border-2 border-neutral-200 rounded-lg",
  tdBody: "first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg px-6 py-4"
};

export const VARIANT_TABLE_SECONDARY = {
  table: "border-spacing-y-4 border-separate",
  name: "secondary",
  trHeader: "bg-neutral-50",
  thHeader: "first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg",
  tBody: "space-y-4",
  trBody: "bg-neutral-50 rounded-lg",
  tdBody: "first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg px-6 py-4"
};

export const VARIANT_TABLE_SECONDARY_WHITE = {
  table: "border-spacing-y-4 border-separate",
  name: "secondary-white",
  trHeader: "bg-neutral-50",
  thHeader: "first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg",
  tBody: "space-y-4",
  trBody: "bg-white rounded-lg",
  tdBody: "first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg px-6 py-4 border-0"
};

export const VARIANT_TABLE_BORDER = {
  table: "border-spacing-y-4 border-separate",
  name: "border",
  trHeader: "border-neutral-200 border bg-blueCustom-50",
  thHeader: "border-neutral-200 border first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg",
  tBody: "space-y-4",
  trBody: "bg-white border rounded-lg",
  tdBody:
    "border-neutral-200 border text-16-light first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg px-6 py-4"
};

export const VARIANT_TABLE_BORDER_ALL = {
  table: "border-spacing-y-4 border-separate",
  name: "border-all",
  trHeader: "border-neutral-200 border bg-blueCustom-100",
  thHeader:
    "border-neutral-200 text-16-bold border first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg",
  tBody: "space-y-4",
  trBody: "bg-white rounded-lg",
  tdBody:
    "border-neutral-200 border-t border-b first:border-l last:border-r text-14-light first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg px-6 py-4"
};

export const VARIANT_TABLE_AIRTABLE = {
  table: "border-collapse",
  name: "border-airtable",
  trHeader: "bg-neutral-150",
  thHeader: "first:rounded-tl-lg last:rounded-tr-lg border-y border-neutral-200 text-14-semibold",
  tBody: "",
  trBody: "bg-white border-y border-neutral-200 lastRow",
  tdBody: "text-16-light px-6 py-3"
};

export const VARIANT_TABLE_VERSION = {
  table: "border-collapse",
  name: "border-airtable",
  trHeader: "bg-transparent",
  thHeader: "text-10-light",
  tBody: "",
  trBody: "bg-transparent border-y border-neutral-200 lastRow",
  tdBody: "text-16-bold"
};
