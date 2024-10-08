import { VARIANT_PAGINATION_TEXT_16, VariantPagination } from "@/components/extensive/Pagination/PaginationVariant";

export interface TableVariant {
  tableWrapper?: string;
  name: string;
  table?: string;
  trHeader: string;
  tBody?: string;
  trBody: string;
  tdBody?: string;
  thHeader?: string;
  thead?: string;
  paginationVariant?: VariantPagination;
}

export const VARIANT_TABLE_PRIMARY = {
  table: "border-spacing-y-4 border-separate",
  name: "primary",
  trHeader: "bg-primary-200",
  thHeader: "first:rounded-tl-lg text-16-bold first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg",
  tBody: "space-y-4",
  trBody: "rounded-lg bg-white",
  tdBody: "first:rounded-tl-lg text-14-light first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg px-6 py-4",
  thead: "bg-blueCustom-100"
};

export const VARIANT_TABLE_SECONDARY = {
  table: "border-spacing-y-4 border-separate",
  name: "secondary",
  trHeader: "bg-neutral-50",
  thHeader: "first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg",
  tBody: "space-y-4",
  trBody: "bg-neutral-50 rounded-lg",
  tdBody: "first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg px-6 py-4",
  thead: "bg-blueCustom-100"
};

export const VARIANT_TABLE_SECONDARY_WHITE = {
  table: "border-spacing-y-4 border-separate",
  name: "secondary-white",
  trHeader: "bg-neutral-50",
  thHeader: "first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg",
  tBody: "space-y-4",
  trBody: "bg-white rounded-lg",
  tdBody: "first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg px-6 py-4 border-0",
  thead: "bg-blueCustom-100"
};

export const VARIANT_TABLE_BORDER = {
  table: "border-spacing-y-4 border-separate",
  name: "border",
  trHeader: "border-neutral-200 border bg-blueCustom-50",
  thHeader: "border-neutral-200 border first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg",
  tBody: "space-y-4",
  trBody: "bg-white border rounded-lg",
  tdBody:
    "border-neutral-200 border text-16-light first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg px-6 py-4",
  thead: "bg-blueCustom-100"
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
    "border-neutral-200 border-t border-b first:border-l last:border-r text-14-light first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg px-6 py-4",
  thead: "bg-blueCustom-100"
};

export const VARIANT_TABLE_AIRTABLE = {
  table: "border-collapse",
  name: "border-airtable",
  trHeader: "bg-neutral-150",
  thHeader: "first:rounded-tl-lg last:rounded-tr-lg border-y border-neutral-200 text-14-semibold first:w-full",
  tBody: "",
  trBody: "bg-white border-y border-neutral-200 lastRow",
  tdBody: "text-16-light px-6 py-3",
  thead: "bg-blueCustom-100",
  paginationVariant: VARIANT_PAGINATION_TEXT_16
};

export const VARIANT_TABLE_SITE_POLYGON_REVIEW = {
  table: "border-collapse",
  name: "border-airtable",
  tableWrapper: "border border-neutral-200 rounded-lg overflow-hidden",
  trHeader: "bg-neutral-150",
  thHeader:
    "first:pl-4 first:pr-2 last:pl-2 last:pr-4 border-y border-neutral-200 text-12-semibold whitespace-normal px-2 border-t-0",
  tBody: "",
  trBody: "bg-white border-y border-neutral-200 last:border-b-0",
  tdBody: "text-12-light px-2 py-3 first:pl-4 first:pr-2 last:pl-2 last:pr-4 whitespace-nowrap",
  thead: "bg-blueCustom-100"
};

export const VARIANT_TABLE_VERSION = {
  table: "border-collapse",
  name: "border-airtable",
  trHeader: "!bg-transparent",
  thHeader: "text-10-light text-white !px-0 !py-2",
  tBody: "",
  trBody: "bg-transparent border-y border-neutral-200 lastRow !group hover:bg-[#ffffff33] py-0.5",
  tdBody: "first:rounded-l-lg last:rounded-r-lg text-10-bold text-white",
  thead: "bg-transparent"
};

export const VARIANT_TABLE_ORGANISATION = {
  table: "border-collapse w-full",
  name: "border-airtable text-left",
  trHeader: "!bg-transparent border-b border-neutral-200",
  thHeader: "text-14-bold text-black !px-2 !py-2 font-bold",
  tBody: "",
  trBody: "bg-white border-b border-neutral-200 last:border-0 hover:bg-gray-100",
  tdBody: "first:rounded-l-lg last:rounded-r-lg text-14-light text-gray-700 px-2 py-3 border-b border-neutral-200",
  thead: "bg-transparent"
};

export const VARIANT_TABLE_DASHBOARD_COUNTRIES = {
  table: "border-collapse",
  name: "border-airtable",
  tableWrapper: "border border-neutral-200 rounded-lg overflow-auto max-h-[267px] lg:max-h-[285px]",
  trHeader: "bg-neutral-150 sticky top-0 z-10 ",
  thHeader: "text-nowrap first:pl-3 first:pr-2 last:pl-2 last:pr-3 border-y border-neutral-200 text-12 px-3 border-t-0",
  tBody: "",
  trBody: "bg-white border-y border-neutral-200 last:border-b-0",
  tdBody: "text-12-light px-3 py-3 first:pl-4 first:pr-2 last:pl-2 last:pr-4",
  thead: "bg-blueCustom-100 "
};

export const VARIANT_TABLE_DASHBOARD_COUNTRIES_MODAL = {
  table: "border-collapse",
  name: "border-airtable",
  tableWrapper: "border border-neutral-200 rounded-lg overflow-auto",
  trHeader: "bg-neutral-150 sticky top-0 z-10 ",
  thHeader: "text-nowrap first:pl-3 first:pr-2 last:pl-2 last:pr-3 border-y border-neutral-200 text-12 px-3 border-t-0",
  tBody: "",
  trBody: "bg-white border-y border-neutral-200 last:border-b-0",
  tdBody: "text-12-light px-3 py-3 first:pl-4 first:pr-2 last:pl-2 last:pr-4",
  thead: "bg-blueCustom-100 "
};

export const VARIANT_TABLE_DASHBOARD = {
  table: "border-collapse",
  name: "border-airtable",
  tableWrapper: "border border-neutral-200 rounded-lg overflow-auto w-full max-h-[calc(100vh-273px)]",
  trHeader: "bg-neutral-150 sticky top-0 z-auto",
  thHeader:
    "first:pl-4 first:pr-2 last:pl-2 last:pr-4 border-y border-neutral-200 text-14-semibold whitespace-normal px-1.5 border-t-0 py-4",
  tBody: "",
  trBody: "bg-white border-y border-neutral-200 last:border-b-0",
  tdBody: "text-14-light px-2 py-4 first:pl-4 first:pr-2 last:pl-2 last:pr-4",
  thead: "text-14-semibold bg-blueCustom-100"
};

export const VARIANT_TABLE_AIRTABLE_DASHBOARD = {
  table: "border-collapse",
  name: "border-airtable",
  tableWrapper: "border border-neutral-200 rounded-lg overflow-auto w-full max-h-[calc(100vh-219px)]",
  trHeader: "bg-neutral-150 sticky top-0 z-auto",
  thHeader:
    "first:pl-4 first:pr-2 last:pl-2 last:pr-4 border-y border-neutral-200 text-14-semibold whitespace-normal px-1.5 border-t-0 py-4",
  tBody: "",
  trBody: "bg-white border-y border-neutral-200 last:border-b-0",
  tdBody: "text-14-light px-2 py-4 first:pl-4 first:pr-2 last:pl-2 last:pr-4",
  thead: "text-14-semibold bg-blueCustom-100"
};
