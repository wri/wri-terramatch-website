import { ColumnDef, RowData } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useBasename, useShowContext } from "react-admin";
import { When } from "react-if";
import { useNavigate } from "react-router-dom";

import ExportProcessingAlert from "@/admin/components/Alerts/ExportProcessingAlert";
import CustomChipField from "@/admin/components/Fields/CustomChipField";
import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_DROPDOWN_SIMPLE } from "@/components/elements/Inputs/Dropdown/DropdownVariant";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import MapContainer from "@/components/elements/Map-mapbox/Map";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_MONITORED } from "@/components/elements/Table/TableVariants";
import FilterSearchBox from "@/components/elements/TableFilters/Inputs/FilterSearchBox";
import { FILTER_SEARCH_MONITORING } from "@/components/elements/TableFilters/Inputs/FilterSearchBoxVariants";
import Text from "@/components/elements/Text/Text";
import Toggle, { TogglePropsItem } from "@/components/elements/Toggle/Toggle";
import Tooltip from "@/components/elements/Tooltip/Tooltip";
import TooltipMapMonitoring from "@/components/elements/TooltipMap/TooltipMapMonitoring";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import {
  DEFAULT_POLYGONS_DATA,
  DEFAULT_POLYGONS_DATA_ECOREGIONS,
  DEFAULT_POLYGONS_DATA_STRATEGIES
} from "@/constants/dashboardConsts";
import { useMonitoredDataContext } from "@/context/monitoredData.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { fetchGetV2IndicatorsEntityUuidSlugExport } from "@/generated/apiComponents";
import { EntityName, OptionValue } from "@/types/common";
import {
  parsePolygonsIndicatorDataForEcoRegion,
  parsePolygonsIndicatorDataForLandUse,
  parsePolygonsIndicatorDataForStrategies,
  parseTreeCoverData
} from "@/utils/dashboardUtils";
import { downloadFileBlob } from "@/utils/network";

import { useMonitoredData } from "../hooks/useMonitoredData";
import MonitoredCharts from "./MonitoredCharts";

interface TableData {
  polygonName: string;
  size: string;
  siteName: string;
  status: string;
  plantDate?: string;
  baseline?: string;
  treePlanting?: string;
  regeneration?: string;
  seeding?: string;
  "2024-2015"?: string;
  "2024-2016"?: string;
  "2024-2017"?: string;
  "2024-2018"?: string;
  "2024-2019"?: string;
  "2024-2020"?: string;
  "2024-2021"?: string;
  "2024-2022"?: string;
  "2024-2023"?: string;
  "2024-2024"?: string;
}

export interface DataStructure extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  tooltipContent: string;
  tableData: TableData[];
}

const COMMON_COLUMNS: ColumnDef<RowData>[] = [
  {
    accessorKey: "poly_name",
    header: "Polygon Name",
    meta: { style: { width: "13.30%" } },
    cell: (props: any) => {
      const value = props.getValue();
      return value == "" || value == "-" ? "-" : value;
    }
  },
  {
    accessorKey: "size",
    header: "Size (ha)",
    meta: { style: { width: "9.01%" } }
  },
  { accessorKey: "site_name", header: "Site Name", meta: { style: { width: "9.90%" } } },
  {
    accessorKey: "status",
    header: "Status",
    cell: (props: any) => (
      <CustomChipField
        label={props.getValue()}
        classNameChipField="!text-[12px] font-medium lg:!text-xs wide:!text-sm"
      />
    ),
    meta: { style: { width: "7.65%" } }
  },
  {
    accessorKey: "plantstart",
    header: "Plant Start Date",
    cell: (props: any) => {
      const value = props.getValue();
      return value == "-" ? "-" : format(new Date(value), "dd/MM/yyyy");
    },
    meta: { style: { width: "13.65%" } }
  },
  {
    accessorKey: "base_line",
    header: "Baseline",
    cell: (props: any) => {
      const value = props.getValue();
      return format(new Date(value), "dd/MM/yyyy");
    },
    meta: { style: { width: "8.87%" } }
  }
];

type CustomColumnDefInternal<TData> = ColumnDef<TData> & { type?: string };

const DROPDOWN_OPTIONS = [
  {
    title: "Tree Cover Loss",
    value: "1",
    slug: "treeCoverLoss"
  },
  {
    title: "Tree Cover Loss from Fire",
    value: "2",
    slug: "treeCoverLossFires"
  },
  {
    title: "Hectares Under Restoration By WWF EcoRegion",
    value: "3",
    slug: "restorationByEcoRegion"
  },
  {
    title: "Hectares Under Restoration By Strategy",
    value: "4",
    slug: "restorationByStrategy"
  },
  {
    title: "Hectares Under Restoration By Target Land Use System",
    value: "5",
    slug: "restorationByLandUse"
  }
];

const toggleItems: TogglePropsItem[] = [
  {
    key: "dashboard",
    render: (
      <Text variant="text-14" className="py-0.5">
        Table
      </Text>
    )
  },
  {
    key: "table",
    render: (
      <Text variant="text-14" className="py-0.5">
        Graph
      </Text>
    )
  },
  {
    key: "table",
    render: (
      <Text variant="text-14" className="py-0.5">
        Map
      </Text>
    )
  }
];

const noDataGraph = (
  <div className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-grey-1000">
    <Text variant={"text-32-semibold"} className="text-blueCustom">
      No Data to Display
    </Text>
    <div className="flex items-center gap-1">
      <Text variant={"text-14"} className="text-darkCustom">
        RUN ANALYSUS ON PROJECT POLYGONS TO SEE DATA
      </Text>
      <Tooltip content={"Tooltip"}>
        <Icon name={IconNames.IC_INFO} className="h-4 w-4" />
      </Tooltip>
    </div>
  </div>
);

const indicatorDescription1 =
  "From the <b>23 August 2024</b> analysis, 12.2M out of 20M hectares are being restored. Of those, <b>Direct Seeding was the most prevalent strategy used with more 765,432ha</b>, followed by Tree Planting with 453,89ha and Assisted Natural Regeneration with 93,345ha.";
const indicatorDescription2 =
  "The numbers and reports below display data related to Indicator 2: Hectares Under Restoration described in TerraFund’s MRV framework. Please refer to the linked MRV framework for details on how these numbers are sourced and verified.";

const noDataMap = (
  <div className="absolute top-0 flex h-full w-full">
    <div className="relative flex w-[23vw] flex-col gap-3 p-6">
      <div className="absolute top-0 left-0 h-full w-full rounded-l-xl bg-white bg-opacity-20 backdrop-blur" />
      <Text
        variant={"text-14-semibold"}
        className="z-10 w-fit border-b-2 border-white border-opacity-20 pb-1.5 text-white"
      >
        Indicator Description
      </Text>
      <div className="z-[5] flex min-h-0 flex-col gap-3 overflow-auto pr-1">
        <Text variant={"text-14-light"} className="text-white" containHtml>
          {indicatorDescription1}
        </Text>
        <Text variant={"text-14-light"} className="text-white" containHtml>
          {indicatorDescription2}
        </Text>
      </div>
    </div>
    <div className="w-full p-6">
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border border-white">
        <div className="absolute top-0 left-0 h-full w-full rounded-xl bg-white bg-opacity-20 backdrop-blur" />
        <Text variant={"text-32-semibold"} className="z-10 text-white">
          No Data to Display
        </Text>
        <div className="flex items-center gap-1">
          <Text variant={"text-14"} className="z-10 text-white">
            RUN ANALYSUS ON PROJECT POLYGONS TO SEE DATA
          </Text>
          <Tooltip content={"Tooltip"}>
            <Icon name={IconNames.IC_INFO_WHITE_BLACK} className="h-4 w-4" />
          </Tooltip>
        </div>
      </div>
    </div>
  </div>
);

const DataCard = ({
  type,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  type?: EntityName;
}) => {
  const [tabActive, setTabActive] = useState(1);
  const [selected, setSelected] = useState<OptionValue[]>(["1"]);
  const [selectedPolygonUuid, setSelectedPolygonUuid] = useState<any>("0");
  const basename = useBasename();
  const mapFunctions = useMap();
  const { record } = useShowContext();
  const { polygonsIndicator, treeCoverLossData, treeCoverLossFiresData, isLoadingIndicator, polygonOptions } =
    useMonitoredData(type!, record.uuid);
  const filteredPolygonsIndicator =
    selectedPolygonUuid !== "0"
      ? polygonsIndicator?.filter((polygon: any) => polygon.poly_id === selectedPolygonUuid)
      : polygonsIndicator;

  const filteredTreeCoverLossData =
    selectedPolygonUuid !== "0"
      ? treeCoverLossData?.filter((data: any) => data.poly_id === selectedPolygonUuid)
      : treeCoverLossData;

  const filteredTreeCoverLossFiresData =
    selectedPolygonUuid !== "0"
      ? treeCoverLossFiresData?.filter((data: any) => data.poly_id === selectedPolygonUuid)
      : treeCoverLossFiresData;

  const parsedData = parseTreeCoverData(filteredTreeCoverLossData, filteredTreeCoverLossFiresData);
  const { setSearchTerm, setIndicatorSlug, indicatorSlug, setSelectPolygonFromMap, selectPolygonFromMap } =
    useMonitoredDataContext();
  const navigate = useNavigate();
  const { openNotification } = useNotificationContext();
  const [exporting, setExporting] = useState<boolean>(false);
  const t = useT();
  const totalHectaresRestoredGoal = record?.total_hectares_restored_goal
    ? Number(record?.total_hectares_restored_goal)
    : +record?.hectares_to_restore_goal;
  const landUseData = filteredPolygonsIndicator
    ? parsePolygonsIndicatorDataForLandUse(filteredPolygonsIndicator, totalHectaresRestoredGoal)
    : DEFAULT_POLYGONS_DATA;
  const strategiesData = filteredPolygonsIndicator
    ? parsePolygonsIndicatorDataForStrategies(filteredPolygonsIndicator)
    : DEFAULT_POLYGONS_DATA_STRATEGIES;

  const ecoRegionData: any = filteredPolygonsIndicator
    ? parsePolygonsIndicatorDataForEcoRegion(filteredPolygonsIndicator)
    : DEFAULT_POLYGONS_DATA_ECOREGIONS;

  const [topHeaderFirstTable, setTopHeaderFirstTable] = useState("102px");
  const [topHeaderSecondTable, setTopHeaderSecondTable] = useState("70px");
  const totalElemIndicator = filteredPolygonsIndicator?.length ? filteredPolygonsIndicator?.length - 1 : null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      setTopHeaderFirstTable(width > 1900 ? "110px" : "106px");
      setTopHeaderSecondTable(width > 1900 ? "77px" : "72px");
    }
  }, []);

  const TABLE_COLUMNS_TREE_COVER_LOSS: CustomColumnDefInternal<RowData>[] = [
    {
      id: "mainInfo",
      meta: { style: { top: `${topHeaderSecondTable}`, borderBottomWidth: 0, borderRightWidth: 0 } },
      header: "",
      columns: [
        {
          accessorKey: "poly_name",
          header: "Polygon Name",
          meta: { style: { top: `${topHeaderFirstTable}`, borderRadius: "0", width: "11%" } }
        },
        {
          accessorKey: "size",
          header: "Size (ha)",
          meta: { style: { top: `${topHeaderFirstTable}`, width: "7%" } }
        },
        {
          accessorKey: "site_name",
          header: "Site Name",
          meta: { style: { top: `${topHeaderFirstTable}`, width: "8%" } }
        },
        {
          accessorKey: "status",
          header: "Status",
          meta: { style: { top: `${topHeaderFirstTable}`, width: "7%" } },
          cell: (props: any) => (
            <CustomChipField
              label={props.getValue()}
              classNameChipField="!text-[12px] font-medium lg:!text-xs wide:!text-sm"
            />
          )
        },
        {
          accessorKey: "plantstart",
          header: () => (
            <>
              Plant
              <br />
              Start Date
            </>
          ),
          meta: { style: { top: `${topHeaderFirstTable}`, width: "8%" } }
        }
      ]
    },
    {
      id: "analysis2024",
      header: totalElemIndicator
        ? `Analysis: ${format(new Date(polygonsIndicator?.[totalElemIndicator]?.created_at!), "MMMM d, yyyy")}`
        : "Analysis:",
      meta: { style: { top: `${topHeaderSecondTable}`, borderBottomWidth: 0 } },
      columns: [
        {
          accessorKey: "data.2015",
          header: "2015",
          meta: { style: { top: `${topHeaderFirstTable}`, width: "5.4%" } }
        },
        {
          accessorKey: "data.2016",
          header: "2016",
          meta: { style: { top: `${topHeaderFirstTable}`, width: "5.4%" } }
        },
        {
          accessorKey: "data.2017",
          header: "2017",
          meta: { style: { top: `${topHeaderFirstTable}`, width: "5.4%" } }
        },
        {
          accessorKey: "data.2018",
          header: "2018",
          meta: { style: { top: `${topHeaderFirstTable}`, width: "5.4%" } }
        },
        {
          accessorKey: "data.2019",
          header: "2019",
          meta: { style: { top: `${topHeaderFirstTable}`, width: "5.4%" } }
        },
        {
          accessorKey: "data.2020",
          header: "2020",
          meta: { style: { top: `${topHeaderFirstTable}`, width: "5.4%" } }
        },
        {
          accessorKey: "data.2021",
          header: "2021",
          meta: { style: { top: `${topHeaderFirstTable}`, width: "5.4%" } }
        },
        {
          accessorKey: "data.2022",
          header: "2022",
          meta: { style: { top: `${topHeaderFirstTable}`, width: "5.4%" } }
        },
        {
          accessorKey: "data.2023",
          header: "2023",
          meta: { style: { top: `${topHeaderFirstTable}`, width: "5.4%" } }
        },
        {
          accessorKey: "data.2024",
          header: "2024",
          meta: { style: { top: `${topHeaderFirstTable}`, width: "5.4%" } }
        }
      ]
    },
    {
      id: "moreInfo",
      header: " ",
      meta: { style: { top: `${topHeaderSecondTable}`, borderBottomWidth: 0, width: "5%" } },
      columns: [
        {
          accessorKey: "more",
          header: "",
          enableSorting: false,
          cell: props => (
            <div className="flex w-full cursor-pointer items-center justify-end rounded p-1 hover:text-primary">
              <button onClick={() => navigate(`${basename}/site/${(props.row.original as any)?.site_id}/show/1`)}>
                <Icon name={IconNames.EDIT_PA} className="h-4 w-4 text-darkCustom-300 hover:text-primary" />
              </button>
            </div>
          ),
          meta: { style: { top: `${topHeaderFirstTable}`, borderRadius: "0" } }
        }
      ]
    }
  ];

  const TABLE_COLUMNS_HECTARES_STRATEGY: ColumnDef<RowData>[] = [
    ...COMMON_COLUMNS,
    {
      accessorKey: "data.tree_planting",
      header: "Tree Planting",
      cell: (props: any) => {
        const value = props.getValue();
        return value ?? "-";
      },
      meta: { style: { width: "11.95%" } }
    },
    {
      accessorKey: "data.assisted_natural_regeneration",
      header: () => (
        <>
          Asst. Nat.
          <br />
          Regeneration
        </>
      ),
      cell: (props: any) => {
        const value = props.getValue();
        return value ?? "-";
      },
      meta: { style: { width: "12.09%" } }
    },
    {
      accessorKey: "data.direct_seeding",
      header: () => (
        <>
          Direct
          <br />
          Seeding
        </>
      ),
      cell: (props: any) => {
        const value = props.getValue();
        return value ?? "-";
      },
      meta: { style: { width: "8.57%" } }
    },
    {
      accessorKey: "more",
      header: "",
      enableSorting: false,
      cell: props => (
        <div className="flex w-full cursor-pointer items-center justify-end rounded p-1 hover:text-primary">
          <button onClick={() => navigate(`${basename}/site/${(props.row.original as any)?.site_id}/show/1`)}>
            <Icon name={IconNames.EDIT_PA} className="h-4 w-4 text-darkCustom-300 hover:text-primary" />
          </button>
        </div>
      ),
      meta: { style: { width: "5%" } }
    }
  ];

  const TABLE_COLUMNS_HECTARES_ECO_REGION: ColumnDef<RowData>[] = [
    ...COMMON_COLUMNS,
    {
      accessorKey: "data.australasian",
      header: "Australasian",
      cell: (props: any) => {
        const value = props.getValue();
        return value ?? "-";
      },
      meta: { style: { width: "11.45%" } }
    },
    {
      accessorKey: "data.afrotropical",
      header: "Afrotropical",
      cell: (props: any) => {
        const value = props.getValue();
        return value ?? "-";
      },
      meta: { style: { width: "11.05%" } }
    },
    {
      accessorKey: "data.paleartic",
      header: "Paleartic11",
      cell: (props: any) => {
        const value = props.getValue();
        return value ?? "-";
      },
      meta: { style: { width: "10.33%" } }
    },
    {
      accessorKey: "more",
      header: "",
      enableSorting: false,
      cell: props => (
        <div className="flex w-full cursor-pointer items-center justify-end rounded p-1 hover:text-primary">
          <button onClick={() => navigate(`${basename}/site/${(props.row.original as any)?.site_id}/show/1`)}>
            <Icon name={IconNames.EDIT_PA} className="h-4 w-4 text-darkCustom-300 hover:text-primary" />
          </button>
        </div>
      ),
      meta: { style: { width: "5%" } }
    }
  ];

  const TABLE_COLUMNS_HECTARES_LAND_USE: ColumnDef<RowData>[] = [
    ...COMMON_COLUMNS,
    {
      accessorKey: "data.agroforest",
      header: "Agroforest",
      cell: (props: any) => {
        const value = props.getValue();
        return value ?? "-";
      },
      meta: { style: { width: "11.95%" } }
    },
    {
      accessorKey: "data.natural_forest",
      header: "Natural Forest",
      cell: (props: any) => {
        const value = props.getValue();
        return value ?? "-";
      },
      meta: { style: { width: "12.09%" } }
    },
    {
      accessorKey: "data.mangrove",
      header: "Mangrove",
      cell: (props: any) => {
        const value = props.getValue();
        return value ?? "-";
      },
      meta: { style: { width: "8.57%" } }
    },
    {
      accessorKey: "more",
      header: "",
      enableSorting: false,
      cell: props => (
        <div className="flex w-full cursor-pointer items-center justify-end rounded p-1 hover:text-primary">
          <button onClick={() => navigate(`${basename}/site/${(props.row.original as any)?.site_id}/show/1`)}>
            <Icon name={IconNames.EDIT_PA} className="h-4 w-4 text-darkCustom-300 hover:text-primary" />
          </button>
        </div>
      ),
      meta: { style: { width: "5%" } }
    }
  ];

  const TABLE_COLUMNS_MAPPING: Record<string, any> = {
    treeCoverLoss: TABLE_COLUMNS_TREE_COVER_LOSS,
    treeCoverLossFires: TABLE_COLUMNS_TREE_COVER_LOSS,
    restorationByEcoRegion: TABLE_COLUMNS_HECTARES_ECO_REGION,
    restorationByStrategy: TABLE_COLUMNS_HECTARES_STRATEGY,
    restorationByLandUse: TABLE_COLUMNS_HECTARES_LAND_USE
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await fetchGetV2IndicatorsEntityUuidSlugExport({
        pathParams: { entity: type!, uuid: record.uuid, slug: indicatorSlug! }
      });
      downloadFileBlob(blob!, `Indicator (${DROPDOWN_OPTIONS.find(item => item.slug === indicatorSlug)?.title}).csv`);

      openNotification("success", t("Success! Export completed."), t("The export has been completed successfully."));
      setExporting(false);
    } catch (error) {
      openNotification("error", t("Error! Export failed."), t("The export has failed. Please try again."));
      setExporting(false);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    if (selectPolygonFromMap?.isOpen) {
      setSelectPolygonFromMap?.({ isOpen: false, uuid: "" });
    }
  }, [selectPolygonFromMap]);
  return (
    <>
      <div className="-mx-4 h-[calc(100vh-200px)] overflow-auto px-4 pb-4">
        <div className="sticky top-[0px] z-[10] rounded-lg border border-grey-850 bg-white shadow-monitored" {...rest}>
          <div className="sticky top-[0px] z-[11] flex items-center justify-between rounded-t-lg bg-white px-6 pb-3 pt-6">
            <div className="flex items-center gap-2">
              <Icon name={IconNames.MONITORING_PROFILE} className="h-8 w-8" />
              <Dropdown
                options={DROPDOWN_OPTIONS}
                onChange={option => {
                  setIndicatorSlug?.(DROPDOWN_OPTIONS.find(item => item.value === option[0])?.slug!);
                  setSelected(option);
                }}
                variant={VARIANT_DROPDOWN_SIMPLE}
                inputVariant="text-18-semibold"
                className="z-50"
                defaultValue={[DROPDOWN_OPTIONS.find(item => item.slug === indicatorSlug)?.value!]}
                optionsClassName="w-max z-50"
              />
            </div>

            <div className="flex items-center gap-2">
              <When condition={tabActive === 0}>
                <FilterSearchBox
                  placeholder="Search"
                  onChange={e => {
                    setSearchTerm(e);
                  }}
                  variant={FILTER_SEARCH_MONITORING}
                />
                <Button variant="white-border" className="!h-[32px] !min-h-[32px] !w-8 p-0" onClick={handleExport}>
                  <Icon name={IconNames.DOWNLOAD_PA} className="h-4 w-4 text-darkCustom" />
                </Button>
              </When>

              <Toggle items={toggleItems} onChangeActiveIndex={setTabActive} defaultActiveIndex={tabActive} />
            </div>
          </div>
          <When condition={tabActive === 0}>
            <div className="relative w-full px-6 pb-6">
              <Table
                columns={TABLE_COLUMNS_MAPPING[indicatorSlug!]}
                data={polygonsIndicator ?? []}
                variant={VARIANT_TABLE_MONITORED}
                classNameWrapper="!overflow-visible"
                visibleRows={50}
                border={1}
              />
            </div>
          </When>
          <When condition={tabActive === 1}>
            <div className="relative z-auto flex w-full max-w-[calc(100vw-356px)] gap-8 px-6 pt-2 pb-6">
              <Dropdown
                containerClassName={classNames("absolute left-full -translate-x-full pr-6 z-[1] !h-8", {
                  hidden: selected.includes("6")
                })}
                optionsClassName="!w-max right-0"
                className="!h-8 w-max"
                options={polygonOptions}
                defaultValue={["0"]}
                onChange={option => setSelectedPolygonUuid(option[0])}
              />
              <div className="sticky top-[77px] flex h-[calc(100vh-320px)] w-1/4 min-w-[25%] max-w-[calc(25vw-356px)] flex-col gap-3">
                <Text variant={"text-14-semibold"} className="w-fit text-blueCustom-900">
                  Indicator Description
                </Text>
                <div className="flex min-h-0 flex-col gap-3 overflow-auto pr-1">
                  <Text variant={"text-14"} className="text-darkCustom" containHtml>
                    {indicatorDescription1}
                  </Text>
                  <Text variant={"text-14"} className="text-darkCustom" containHtml>
                    {indicatorDescription2}
                  </Text>
                </div>
              </div>
              <MonitoredCharts
                selected={selected}
                isLoadingIndicator={isLoadingIndicator}
                parsedData={parsedData}
                ecoRegionData={ecoRegionData}
                strategiesData={strategiesData}
                landUseData={landUseData}
                record={record}
                totalHectaresRestoredGoal={totalHectaresRestoredGoal}
              />
              <When condition={selected.includes("6")}>{noDataGraph}</When>
            </div>
          </When>
          <When condition={tabActive === 2}>
            <div className="relative h-[calc(100vh-295px)] w-full">
              <div className="absolute left-1/2 top-6 z-10">
                <TooltipMapMonitoring />
              </div>
              <MapContainer
                className="!h-full"
                mapFunctions={mapFunctions}
                sitePolygonData={[]}
                hasControls={!selected.includes("6")}
                showLegend={!selected.includes("6")}
                legendPosition="bottom-right"
                showViewGallery={false}
              />
              <When condition={selected.includes("6")}>{noDataMap}</When>
            </div>
          </When>
        </div>
      </div>
      <ExportProcessingAlert show={exporting} />
    </>
  );
};

export default DataCard;
