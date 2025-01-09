import {
  VARIANT_PAGINATION_DASHBOARD,
  VARIANT_PAGINATION_MONITORED,
  VariantPagination
} from "@/components/extensive/Pagination/PaginationVariant";

export interface TableVariant {
  className?: string;
  tableWrapper?: string;
  name: string;
  table?: string;
  trHeader: string;
  thHeaderSort?: string;
  thHeaderSticky?: string;
  tBody?: string;
  trBody: string;
  tdBody?: string;
  thHeader?: string;
  thead?: string;
  paginationVariant?: VariantPagination;
  tdBodySticky?: string;
  iconSort?: string;
}

export const VARIANT_TABLE_PRIMARY = {
  table: "border-spacing-y-4 border-separate",
  name: "primary",
  trHeader: "bg-primary-200",
  thHeader: "first:rounded-tl-lg text-16-bold first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg",
  tBody: "space-y-4",
  trBody: "rounded-lg bg-white",
  tdBody: "first:rounded-tl-lg text-14-light first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg px-6 py-4",
  thead: "bg-blueCustom-100",
  paginationVariant: VARIANT_PAGINATION_DASHBOARD
};

export const VARIANT_TABLE_SECONDARY = {
  table: "border-spacing-y-4 border-separate",
  name: "secondary",
  trHeader: "bg-neutral-50",
  thHeader: "first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg",
  tBody: "space-y-4",
  trBody: "bg-neutral-50 rounded-lg",
  tdBody: "first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg px-6 py-4",
  thead: "bg-blueCustom-100",
  paginationVariant: VARIANT_PAGINATION_DASHBOARD
};

export const VARIANT_TABLE_SECONDARY_WHITE = {
  table: "border-spacing-y-4 border-separate",
  name: "secondary-white",
  trHeader: "bg-neutral-50",
  thHeader: "first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg",
  tBody: "space-y-4",
  trBody: "bg-white rounded-lg",
  tdBody: "first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg px-6 py-4 border-0",
  thead: "bg-blueCustom-100",
  paginationVariant: VARIANT_PAGINATION_DASHBOARD
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
  thead: "bg-blueCustom-100",
  paginationVariant: VARIANT_PAGINATION_DASHBOARD
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
  thead: "bg-blueCustom-100",
  paginationVariant: VARIANT_PAGINATION_DASHBOARD
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
  paginationVariant: VARIANT_PAGINATION_DASHBOARD
};

export const VARIANT_TABLE_SITE_POLYGON_REVIEW = {
  table: "border-collapse",
  name: "border-airtable",
  tableWrapper: "border border-neutral-200 rounded-lg overflow-hidden",
  trHeader: "bg-neutral-150 sticky top-0 z-auto",
  thHeader:
    "first:pl-4 first:pr-2 last:pl-2 last:pr-4 border-y border-neutral-200 text-14-semibold whitespace-normal px-2 border-t-0 sticky top-0 z-auto",
  tBody: "",
  trBody: "bg-white border-y border-neutral-200 last:border-b-0",
  tdBody: "text-14-light px-2 py-3 first:pl-4 first:pr-2 last:pl-2 last:pr-4 ",
  thead: "bg-blueCustom-100",
  paginationVariant: VARIANT_PAGINATION_DASHBOARD
};

export const VARIANT_TABLE_VERSION = {
  table: "border-collapse",
  name: "border-airtable",
  trHeader: "!bg-transparent",
  thHeader: "text-10-light text-white !px-0 !py-2",
  tBody: "",
  trBody: "bg-transparent border-y border-neutral-200 lastRow !group hover:bg-[#ffffff33] py-0.5",
  tdBody: "first:rounded-l-lg last:rounded-r-lg text-10-bold text-white",
  thead: "bg-transparent",
  paginationVariant: VARIANT_PAGINATION_DASHBOARD
};

export const VARIANT_TABLE_ORGANISATION = {
  table: "border-collapse w-full",
  name: "border-airtable text-left",
  trHeader: "!bg-transparent border-b border-neutral-200",
  thHeader: "text-14-bold text-black !px-2 !py-2 font-bold",
  tBody: "",
  trBody: "bg-white border-b border-neutral-200 last:border-0 hover:bg-gray-100",
  tdBody: "first:rounded-l-lg last:rounded-r-lg text-14-light text-gray-700 px-2 py-3 border-b border-neutral-200",
  thead: "bg-transparent",
  paginationVariant: VARIANT_PAGINATION_DASHBOARD
};

export const VARIANT_TABLE_DASHBOARD_COUNTRIES = {
  table: "border-collapse",
  name: "border-airtable",
  tableWrapper: "border border-neutral-200 rounded-lg overflow-auto max-h-[260px] lg:max-h-[303px] wide:max-h-[321px]",
  trHeader: "bg-neutral-150 sticky top-0 z-[1]",
  thHeader: "text-nowrap first:pl-3 first:pr-2 last:pl-2 last:pr-3 border-y border-neutral-200 text-14 px-3 border-t-0",
  tBody: "",
  trBody: "bg-white border-y border-neutral-200 last:border-b-0",
  tdBody: "text-14-light px-3 py-3 first:pl-4 first:pr-2 last:pl-2 last:pr-4",
  thead: "bg-blueCustom-100 ",
  paginationVariant: VARIANT_PAGINATION_DASHBOARD
};

export const VARIANT_TABLE_DASHBOARD_COUNTRIES_MODAL = {
  table: "border-collapse",
  name: "border-airtable",
  tableWrapper: "border border-neutral-200 rounded-lg overflow-auto max-h-[calc(90vh-208px)]",
  trHeader: "bg-neutral-150 sticky top-0 z-10 ",
  thHeader: "text-nowrap first:pl-3 first:pr-2 last:pl-2 last:pr-3 border-y border-neutral-200 text-12 px-3 border-t-0",
  tBody: "",
  trBody: "bg-white border-y border-neutral-200 last:border-b-0",
  tdBody: "text-12-light px-3 py-3 first:pl-4 first:pr-2 last:pl-2 last:pr-4",
  thead: "bg-blueCustom-100 ",
  paginationVariant: VARIANT_PAGINATION_DASHBOARD
};

export const VARIANT_TABLE_DASHBOARD = {
  className: "h-full",
  table: "border-collapse",
  name: "border-airtable",
  tableWrapper: "border border-neutral-200 rounded-lg w-full bg-white",
  trHeader: "bg-neutral-150 sticky top-0 z-[1]",
  thHeader:
    "first:pl-4 first:rounded-tl-lg bg-neutral-150 first:pr-2 last:pl-2 last:pr-4 last:rounded-tr-lg border-neutral-200 text-14-semibold whitespace-normal px-1.5 py-4",
  tBody: "",
  trBody: "bg-white border-y border-neutral-200 last:border-b-0",
  tdBody: "text-14-light px-2 py-4 first:pl-4 first:pr-2 last:pl-2 last:pr-4",
  thead: "text-14-semibold bg-blueCustom-100",
  paginationVariant: VARIANT_PAGINATION_DASHBOARD
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
  thead: "text-14-semibold bg-blueCustom-100",
  paginationVariant: VARIANT_PAGINATION_DASHBOARD
};

export const VARIANT_TABLE_MONITORED = {
  table: "w-full border-separate border-spacing-0",
  name: "border-airtable",
  tableWrapper: "border-b rounded-lg border-neutral-200",
  trHeader: "bg-white static z-[1] top-[72px] lg:top-[77px] first:rounded-tl-lg last:rounded-tr-lg first:!border-b-0",
  thHeader:
    "border-collapse first:border-l last:border-r last:!border-l-0 first:rounded-tl-lg last:rounded-tr-lg z-[1] sticky top-[77px] lg:top-[77px] text-nowrap first:pl-2 first:pr-2 last:pr-2  border-neutral-200 text-12-semibold px-1.5 border-y py-2 bg-neutral-50",
  tBody: "",
  thHeaderSort: "!border-x !place-items-center py-2",
  trBody: "bg-white border-y border-neutral-200 sticky z-[0] top-[87px] last:border-b",
  tdBody:
    "text-12-light px-1.5 py-2 first:pl-2 first:pr-2 last:pr-2 bg-white border-collapse sticky z-[0] top-[87px] first:border-l last:border-r border-neutral-200 ",
  thead: "bg-white ",
  paginationVariant: VARIANT_PAGINATION_MONITORED,
  thHeaderSticky: "sticky left-0 z-10 after:drop-shadow-lg drop-shadow-lg",
  tdBodySticky: "sticky left-0 z-10 after:drop-shadow-lg drop-shadow-lg",
  iconSort: "!w-2.5 !h-2.5 object-cover !ml-0"
};

export const VARIANT_TABLE_TREE_SPECIES = {
  table: "border-collapse w-full",
  name: "border-airtable text-left",
  trHeader: "!bg-transparent border-b border-neutral-650 text-14 text-neutral-650 ",
  thHeader: " text-14 uppercase !pr-4 !pl-0 !py-2 font-medium text-14",
  tBody: "",
  trBody: "bg-white border-b border-neutral-200 last:border-0 hover:bg-gray-100",
  tdBody: "first:rounded-l-lg last:rounded-r-lg text-16-light text-gray-700 pr-4 pl-0 py-3 border-b border-neutral-200",
  paginationVariant: VARIANT_PAGINATION_DASHBOARD,
  thead: "bg-transparent"
};
