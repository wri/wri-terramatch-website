import { SortingState } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";

import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_RIGHT_TOP } from "@/components/elements/Menu/MenuVariant";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_SITE_POLYGON_REVIEW } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import Pagination from "@/components/extensive/Pagination";
import { VARIANT_PAGINATION_POLYGON_REVIEW } from "@/components/extensive/Pagination/PaginationVariant";

import { SitePolygonRow } from "../..";

interface TableItemMenuProps {
  ellipse: boolean;
  "planting-start-date": string | null;
  "polygon-name": string;
  "restoration-practice": string;
  source?: string;
  "target-land-use-system": string | null;
  "tree-distribution": string | null;
  uuid: string;
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
  containerRef
}: {
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
}) {
  const tableItemMenu = (props: TableItemMenuProps) => [
    {
      id: "1",
      render: () => (
        <div
          className="-mb-1.5 flex w-full items-center gap-2 border-b border-[#E7E6E6] pb-1.5"
          onClick={() => setPolygonFromMap({ isOpen: true, uuid: props.uuid })}
        >
          <Icon name={IconNames.AREA} className="h-4 max-h-4 w-4" />
          <Text variant="text-16-light" className="w-[11.5rem] text-left">
            Open Polygon
          </Text>
        </div>
      )
    },
    {
      id: "2",
      render: () => (
        <div
          className="-mb-1.5 flex w-full items-center gap-2 border-b border-[#E7E6E6] pb-1.5"
          onClick={() => flyToPolygonBounds(props.uuid)}
        >
          <Icon name={IconNames.SEARCH_WRI} className="h-4 max-h-4 w-4" />
          <Text variant="text-16-light" className="w-[11.5rem] text-left">
            Zoom to
          </Text>
        </div>
      )
    },
    {
      id: "3",
      render: () => (
        <div
          className="-mb-1.5 flex w-full items-center gap-2 border-b border-[#E7E6E6] pb-1.5"
          onClick={() => openFormModalHandlerConfirmDeletion(props.uuid)}
        >
          <Icon name={IconNames.TRASH_WRI} className="h-4 max-h-4 w-4" />
          <Text variant="text-16-light" className="w-[11.5rem] text-left">
            Delete Polygon
          </Text>
        </div>
      )
    }
  ];

  return (
    <div className="mb-6 w-[inherit]" style={{ width: containerRef.current?.clientWidth }}>
      <div className="mb-4">
        <Text variant="text-16-bold" className="mb-2 text-darkCustom">
          Site Attribute Table
        </Text>
        <Text variant="text-14-light" className="text-darkCustom">
          Edit attribute table for all polygons quickly through the table below. Alternatively, open a polygon and edit
          the attributes in the map above.
        </Text>
        <div className="mt-4 flex gap-3">
          <div className="w-[12.5rem] rounded-lg border-2 border-neutral-300 p-3">
            <Text variant="text-14-light" className="flex items-center gap-1 text-[#5C5959]">
              <Icon name={IconNames.TREE_DASHABOARD} className="h-3.5 w-3.5 text-[#477010]" /> Trees Planted
            </Text>
            <Text variant="text-16-bold" className="text-[#1A1919]">
              X,XXX
            </Text>
          </div>
          <div className="w-[12.5rem] rounded-lg border-2 border-neutral-300 p-3">
            <Text variant="text-14-light" className="flex items-center gap-1 text-[#5C5959]">
              <Icon name={IconNames.AREA} className="h-3.5 w-3.5 text-[#477010]" /> Calculated Area
            </Text>
            <Text variant="text-16-bold" className="text-[#1A1919]">
              X,XXX
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
        contentClassName={"w-[inherit] !px-0"}
        onTableStateChange={state =>
          setSorting(typeof state.sorting === "function" ? state.sorting(sorting) : state.sorting)
        }
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
              style: { width: "8.0625rem" },
              cellStyles: { className: "w-[8.0625rem] wide:w-[13.0625rem] min-w-[8.0625rem]" }
            }
          },
          {
            header: "Target Land Use System",
            accessorKey: "target-land-use-system",
            meta: {
              style: { width: "9.1875rem" },
              cellStyles: { className: "w-[9.1875rem] wide:w-[14.1875rem] min-w-[9.1875rem]" }
            }
          },
          {
            header: "Tree Distribution",
            accessorKey: "tree-distribution",
            meta: {
              style: { width: "8.1875rem" },
              cellStyles: { className: "w-[8.1875rem] wide:w-[13.1875rem] min-w-[8.1875rem]" }
            }
          },
          {
            header: "Planting Start Date",
            accessorKey: "planting-start-date",
            meta: {
              style: { width: "7.5875rem" },
              cellStyles: { className: "w-[7.5875rem] wide:w-[12.5875rem] min-w-[7.5875rem]" }
            }
          },
          {
            header: "Trees Planted",
            accessorKey: "num-trees",
            meta: {
              style: { width: "7.1875rem" },
              cellStyles: { className: "w-[7.1875rem] wide:w-[12.1875rem] min-w-[7.1875rem]" }
            },
            cell: (_: any) => <span>XXX,XXX.XX</span>
          },
          {
            header: "Calculated Area",
            accessorKey: "size",
            meta: {
              style: { width: "7.1875rem" },
              cellStyles: { className: "w-[7.1875rem] wide:w-[12.1875rem] min-w-[7.1875rem]" }
            },
            cell: (_: any) => <span>XXX,XXX.XX</span>
          },
          {
            header: "Source",
            accessorKey: "source",
            meta: {
              style: { width: "5.1875rem" },
              cellStyles: {
                className: "w-[5.1875rem] wide:w-[10.1875rem] wide:min-w-[10.1875rem] min-w-[5.1875rem]"
              }
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
            cell: props => (
              <Menu
                menu={tableItemMenu(props?.row?.original as TableItemMenuProps)}
                placement={MENU_PLACEMENT_RIGHT_TOP}
              >
                <div className="rounded p-1 hover:bg-primary-200">
                  <Icon name={IconNames.ELIPSES} className="h-4 w-4 rounded-sm text-grey-720 hover:bg-primary-200" />
                </div>
              </Menu>
            )
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
