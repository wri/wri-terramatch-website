import { SortingState } from "@tanstack/react-table";
import { Dispatch, SetStateAction, useCallback } from "react";

import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_RIGHT_TOP } from "@/components/elements/Menu/MenuVariant";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_SITE_POLYGON_REVIEW } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import Pagination from "@/components/extensive/Pagination";
import { VARIANT_PAGINATION_POLYGON_REVIEW } from "@/components/extensive/Pagination/PaginationVariant";

import { PolygonTotals, SitePolygonRow } from "../..";

// Type guard to safely extract menu props from SitePolygonRow
function isValidMenuProps(row: SitePolygonRow): row is SitePolygonRow & { uuid: string } {
  return row.uuid !== undefined && row.uuid !== null;
}

interface SiteAttributeTableProps {
  setPolygonFromMap: (polygon: { isOpen: boolean; uuid: string }) => void;
  flyToPolygonBounds: (uuid: string) => void;
  openFormModalHandlerConfirmDeletion: (uuid: string) => void;
  setSorting: (sorting: SortingState) => void;
  sorting: SortingState;
  paginatedData: SitePolygonRow[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
  containerRef: React.RefObject<HTMLDivElement>;
  totals: PolygonTotals;
  isLoading: boolean;
}

export default function SiteAttributeTable({
  setPolygonFromMap,
  flyToPolygonBounds,
  openFormModalHandlerConfirmDeletion,
  setSorting,
  sorting,
  paginatedData,
  currentPage,
  totalPages,
  pageSize,
  setCurrentPage,
  setPageSize,
  containerRef,
  totals,
  isLoading
}: SiteAttributeTableProps) {
  const tableItemMenu = useCallback(
    (props: SitePolygonRow & { uuid: string }) => [
      {
        id: "1",
        render: () => (
          <div
            className="flex w-full min-w-[12rem] items-center gap-2 border-b border-[#E7E6E6] pb-1.5"
            onClick={() => setPolygonFromMap({ isOpen: true, uuid: props.uuid })}
          >
            <Icon name={IconNames.AREA} className="h-4 w-4 flex-shrink-0" />
            <Text variant="text-16-light" className="flex-1 text-left">
              Open Polygon
            </Text>
          </div>
        )
      },
      {
        id: "2",
        render: () => (
          <div
            className="flex w-full min-w-[12rem] items-center gap-2 border-b border-[#E7E6E6] pb-1.5"
            onClick={() => flyToPolygonBounds(props.uuid)}
          >
            <Icon name={IconNames.SEARCH_WRI} className="h-4 w-4 flex-shrink-0" />
            <Text variant="text-16-light" className="flex-1 text-left">
              Zoom to
            </Text>
          </div>
        )
      },
      {
        id: "3",
        render: () => (
          <div
            className="flex w-full min-w-[12rem] items-center gap-2 pb-1.5"
            onClick={() => openFormModalHandlerConfirmDeletion(props.uuid)}
          >
            <Icon name={IconNames.TRASH_WRI} className="h-4 w-4 flex-shrink-0" />
            <Text variant="text-16-light" className="flex-1 text-left">
              Delete Polygon
            </Text>
          </div>
        )
      }
    ],
    [setPolygonFromMap, flyToPolygonBounds, openFormModalHandlerConfirmDeletion]
  );

  return (
    <div className="mb-6 w-[inherit]">
      <div className="mb-4">
        <Text variant="text-16-bold" className="mb-2 text-darkCustom">
          Site Attribute Table
        </Text>
        <Text variant="text-14-light" className="text-darkCustom">
          Edit attribute table for all polygons quickly through the table below. Alternatively, open a polygon and edit
          the attributes in the map above.
        </Text>
        <div className="mt-4 flex gap-4">
          <div className="shadow-sm hover:shadow-md flex w-[14rem] flex-col items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-white p-4 transition-shadow">
            <div className="mb-1 flex items-center gap-2">
              <Icon name={IconNames.TREE_DASHABOARD} className="h-4 w-4 text-[#477010]" />
              <Text variant="text-14-light" className="text-neutral-600">
                Trees Planted
              </Text>
            </div>
            <Text variant="text-24-bold" className="text-center text-[#1A1919]">
              {isLoading ? "..." : totals.totalTreesPlanted.toLocaleString()}
            </Text>
          </div>
          <div className="shadow-sm hover:shadow-md flex w-[14rem] flex-col items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-white p-4 transition-shadow">
            <div className="mb-1 flex items-center gap-2">
              <Icon name={IconNames.AREA} className="h-4 w-4 text-[#477010]" />
              <Text variant="text-14-light" className="text-neutral-600">
                Calculated Area
              </Text>
            </div>
            <Text variant="text-24-bold" className="text-center text-[#1A1919]">
              {isLoading ? "..." : `${totals.totalCalculatedArea.toLocaleString()} ha`}
            </Text>
          </div>
        </div>
      </div>
      <Table
        variant={VARIANT_TABLE_SITE_POLYGON_REVIEW}
        hasPagination={false}
        visibleRows={10000000}
        classNameTableWrapper="!overflow-x-auto"
        serverSideData
        classNameWrapper="!px-0"
        contentClassName={"w-[inherit] !px-0"}
        onTableStateChange={state => {
          const newSorting = typeof state.sorting === "function" ? state.sorting(sorting) : state.sorting;
          setSorting(newSorting);
        }}
        columns={[
          {
            header: "Polygon Name",
            accessorKey: "polygon-name",
            meta: {
              sticky: true,
              style: { width: "12.875rem", position: "sticky", left: 0 },
              cellStyles: {
                className: "w-[12.875rem] wide:w-[17.875rem] min-w-[12.875rem] pr-6 sticky left-0"
              },
              className: "whitespace-nowrap wide:w-[17.875rem] pr-6 sticky left-0 z-20"
            }
          },
          {
            header: "Restoration Practice",
            accessorKey: "restoration-practice",
            meta: {
              style: { width: "10rem", paddingLeft: "1rem", paddingRight: "1rem" },
              cellStyles: {
                style: { paddingLeft: "1rem", paddingRight: "1rem" },
                className: "w-[10rem] wide:w-[15rem] min-w-[10rem]"
              },
              className: "!px-4"
            }
          },
          {
            header: "Target Land Use System",
            accessorKey: "target-land-use-system",
            meta: {
              style: { width: "11rem", paddingLeft: "1rem", paddingRight: "1rem" },
              cellStyles: {
                style: { paddingLeft: "1rem", paddingRight: "1rem" },
                className: "w-[11rem] wide:w-[16rem] min-w-[11rem]"
              },
              className: "!px-4"
            }
          },
          {
            header: "Tree Distribution",
            accessorKey: "tree-distribution",
            meta: {
              style: { width: "10rem", paddingLeft: "1rem", paddingRight: "1rem" },
              cellStyles: {
                style: { paddingLeft: "1rem", paddingRight: "1rem" },
                className: "w-[10rem] wide:w-[15rem] min-w-[10rem]"
              },
              className: "!px-4"
            }
          },
          {
            header: "Planting Start Date",
            accessorKey: "planting-start-date",
            meta: {
              style: { width: "9.5rem", paddingLeft: "1rem", paddingRight: "1rem" },
              cellStyles: {
                style: { paddingLeft: "1rem", paddingRight: "1rem" },
                className: "w-[9.5rem] wide:w-[14.5rem] min-w-[9.5rem]"
              },
              className: "!px-4"
            }
          },
          {
            header: "Trees Planted",
            accessorKey: "num-trees",
            meta: {
              style: { width: "9rem", paddingLeft: "1rem", paddingRight: "1rem" },
              cellStyles: {
                style: { paddingLeft: "1rem", paddingRight: "1rem" },
                className: "w-[9rem] wide:w-[14rem] min-w-[9rem]"
              },
              className: "!px-4"
            },
            cell: info => {
              const value = info.row.original["num-trees"];
              return <span className="whitespace-nowrap">{value.toLocaleString()}</span>;
            }
          },
          {
            header: "Calculated Area",
            accessorKey: "calc-area",
            meta: {
              style: { width: "10rem", paddingLeft: "1rem", paddingRight: "1rem" },
              cellStyles: {
                style: { paddingLeft: "1rem", paddingRight: "1rem" },
                className: "w-[10rem] wide:w-[15rem] min-w-[10rem]"
              },
              className: "!px-4"
            },
            cell: info => {
              const calculatedArea = info.row.original["calc-area"].toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              });
              return <span className="whitespace-nowrap">{`${calculatedArea} ha`}</span>;
            }
          },
          {
            header: "Source",
            accessorKey: "source",
            meta: {
              style: { width: "7rem", paddingLeft: "1rem", paddingRight: "1rem" },
              cellStyles: {
                style: { paddingLeft: "1rem", paddingRight: "1rem" },
                className: "w-[7rem] wide:w-[12rem] wide:min-w-[12rem] min-w-[7rem]"
              },
              className: "!px-4"
            }
          },
          {
            header: "",
            accessorKey: "ellipse",
            enableSorting: false,
            meta: {
              sticky: true,
              style: { position: "sticky", right: 0 },
              cellStyles: {
                className: " pr-6 sticky right-0 relative"
              },
              className: "whitespace-nowrap pr-6 sticky right-0 z-20 relative"
            },
            cell: info => {
              const rowData = info.row.original;
              if (!isValidMenuProps(rowData)) {
                return null;
              }
              return (
                <Menu
                  menu={tableItemMenu(rowData)}
                  placement={MENU_PLACEMENT_RIGHT_TOP}
                  classNameContentMenu="min-w-[12rem] max-w-[16rem] w-auto"
                >
                  <div className="rounded p-1 hover:bg-primary-200">
                    <Icon name={IconNames.ELIPSES} className="h-4 w-4 rounded-sm text-grey-720 hover:bg-primary-200" />
                  </div>
                </Menu>
              );
            }
          }
        ]}
        data={paginatedData}
      />
      <div className="mt-4 mb-20">
        <div className="relative">
          <Pagination
            pageIndex={currentPage - 1}
            nextPage={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            getCanNextPage={() => currentPage < totalPages}
            previousPage={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            getCanPreviousPage={() => currentPage > 1}
            getPageCount={() => totalPages}
            setPageIndex={(index: number) => setCurrentPage(index + 1)}
            hasPageSizeSelector
            defaultPageSize={pageSize}
            setPageSize={size => {
              setCurrentPage(1);
              setPageSize(size);
            }}
            variant={VARIANT_PAGINATION_POLYGON_REVIEW}
            containerClassName="justify-between"
            invertSelect
          />
        </div>
      </div>
    </div>
  );
}
