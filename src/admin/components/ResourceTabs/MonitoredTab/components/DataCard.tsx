import { ColumnDef, RowData } from "@tanstack/react-table";
import classNames from "classnames";
import React, { useState } from "react";
import { Else, If, Then, When } from "react-if";

import CustomChipField from "@/admin/components/Fields/CustomChipField";
import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_DROPDOWN_SIMPLE } from "@/components/elements/Inputs/Dropdown/DropdownVariant";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import MapContainer from "@/components/elements/Map-mapbox/Map";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_LEFT_HALF_BOTTOM } from "@/components/elements/Menu/MenuVariant";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_MONITORED } from "@/components/elements/Table/TableVariants";
import FilterSearchBox from "@/components/elements/TableFilters/Inputs/FilterSearchBox";
import { FILTER_SEARCH_MONITORING } from "@/components/elements/TableFilters/Inputs/FilterSearchBoxVariants";
import Text from "@/components/elements/Text/Text";
import Toggle, { TogglePropsItem } from "@/components/elements/Toggle/Toggle";
import Tooltip from "@/components/elements/Tooltip/Tooltip";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { DUMMY_DATA_TARGET_LAND_USE_TYPES_REPRESENTED } from "@/constants/dashboardConsts";
import GraphicIconDashboard from "@/pages/dashboard/components/GraphicIconDashboard";
import { OptionValue } from "@/types/common";

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

const tableItemMenu = () => [
  {
    id: "1",
    render: () => (
      <div className="flex items-center gap-2" onClick={() => {}}>
        <Icon name={IconNames.POLYGON} className="h-6 w-6" />
        <Text variant="text-12-bold">Edit</Text>
      </div>
    )
  },
  {
    id: "2",
    render: () => (
      <div className="flex items-center gap-2" onClick={() => {}}>
        <Icon name={IconNames.TRASH_PA} className="h-5 w-5" />
        <Text variant="text-12-bold">Delete</Text>
      </div>
    )
  }
];

const TABLE_COLUMNS: ColumnDef<RowData>[] = [
  {
    id: "mainInfo",
    meta: { style: { top: "70px", borderBottomWidth: 0, borderRightWidth: 0 } },
    header: "",
    columns: [
      { accessorKey: "polygonName", header: "Polygon Name", meta: { style: { top: "102px", borderRadius: "0" } } },
      {
        accessorKey: "size",
        header: "Size (ha)",
        meta: { style: { top: "102px" } }
      },
      { accessorKey: "siteName", header: "Site Name", meta: { style: { top: "102px" } } },
      {
        accessorKey: "status",
        header: "Status",
        meta: { style: { top: "102px" } },
        cell: (props: any) => (
          <CustomChipField
            label={props.getValue()}
            classNameChipField="!text-[10px] font-medium lg:!text-xs wide:!text-sm"
          />
        )
      },
      {
        accessorKey: "plantDate",
        header: () => (
          <>
            Plant
            <br />
            Start Date
          </>
        ),
        meta: { style: { top: "102px" } }
      }
    ]
  },
  {
    id: "analysis2024",
    header: "Analysis: April 25, 2024",
    meta: { style: { top: "70px", borderBottomWidth: 0 } },
    columns: [
      {
        accessorKey: "2024-2015",
        header: "2015",
        meta: { style: { top: "102px" } }
      },
      {
        accessorKey: "2024-2016",
        header: "2016",
        meta: { style: { top: "102px" } }
      },
      {
        accessorKey: "2024-2017",
        header: "2017",
        meta: { style: { top: "102px" } }
      },
      {
        accessorKey: "2024-2018",
        header: "2018",
        meta: { style: { top: "102px" } }
      },
      {
        accessorKey: "2024-2019",
        header: "2019",
        meta: { style: { top: "102px" } }
      },
      {
        accessorKey: "2024-2020",
        header: "2020",
        meta: { style: { top: "102px" } }
      },
      {
        accessorKey: "2024-2021",
        header: "2021",
        meta: { style: { top: "102px" } }
      },
      {
        accessorKey: "2024-2022",
        header: "2022",
        meta: { style: { top: "102px" } }
      },
      {
        accessorKey: "2024-2023",
        header: "2023",
        meta: { style: { top: "102px" } }
      },
      {
        accessorKey: "2024-2024",
        header: "2024",
        meta: { style: { top: "102px" } }
      }
    ]
  },
  {
    id: "moreInfo",
    header: " ",
    meta: { style: { top: "70px", borderBottomWidth: 0 } },
    columns: [
      {
        accessorKey: "more",
        header: "",
        enableSorting: false,
        cell: props => (
          <Menu menu={tableItemMenu()} placement={MENU_PLACEMENT_LEFT_HALF_BOTTOM}>
            <div className="rounded p-1 hover:bg-primary-200">
              <Icon name={IconNames.ELIPSES} className="roudn h-4 w-4 rounded-sm text-grey-720 hover:bg-primary-200" />
            </div>
          </Menu>
        ),
        meta: { style: { top: "102px", borderRadius: "0" } }
      }
    ]
  }
];

const TABLE_COLUMNS_HECTARES: ColumnDef<RowData>[] = [
  { accessorKey: "polygonName", header: "Polygon Name" },
  {
    accessorKey: "size",
    header: "Size (ha)"
  },
  { accessorKey: "siteName", header: "Site Name" },
  {
    accessorKey: "status",
    header: "Status",
    cell: (props: any) => (
      <CustomChipField
        label={props.getValue()}
        classNameChipField="!text-[10px] font-medium lg:!text-xs wide:!text-sm"
      />
    )
  },
  {
    accessorKey: "plantDate",
    header: "Plant Start Date"
  },
  {
    accessorKey: "baseline",
    header: "Baseline"
  },
  {
    accessorKey: "treePlanting",
    header: "Tree Planting"
  },
  {
    accessorKey: "regeneration",
    header: () => (
      <>
        Asst. Nat.
        <br />
        Regeneration
      </>
    )
  },
  {
    accessorKey: "seeding",
    header: () => (
      <>
        Direct
        <br />
        Seeding
      </>
    )
  },
  {
    accessorKey: "more",
    header: "",
    enableSorting: false,
    cell: props => (
      <Menu menu={tableItemMenu()} placement={MENU_PLACEMENT_LEFT_HALF_BOTTOM} className="z-auto">
        <div className="rounded p-1 hover:bg-primary-200">
          <Icon name={IconNames.ELIPSES} className="roudn h-4 w-4 rounded-sm text-grey-720 hover:bg-primary-200" />
        </div>
      </Menu>
    )
  }
];

const TABLE_DATA = [
  {
    polygonName: "ABA",
    siteName: "Palm Oil",
    status: "Draft",
    size: "7,473",
    plantDate: "9/26/24",
    baseline: "25/4/24",
    treePlanting: "0.423",
    regeneration: "0.120",
    seeding: "0.120",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966"
  },
  {
    polygonName: "Adison Thaochu A",
    siteName: "Palm Oil",
    status: "Submitted",
    size: "7,473",
    plantDate: "9/26/24",
    baseline: "25/4/24",
    treePlanting: "0.423",
    regeneration: "0.120",
    seeding: "0.120",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966"
  },
  {
    polygonName: "AEK Nabara Selatan",
    siteName: "Palm Oil",
    status: "Needs Info",
    size: "7,473",
    plantDate: "9/26/24",
    baseline: "25/4/24",
    treePlanting: "0.423",
    regeneration: "0.120",
    seeding: "0.120",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966"
  },
  {
    polygonName: "AEK Raso",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    plantDate: "9/26/24",
    baseline: "25/4/24",
    treePlanting: "0.423",
    regeneration: "0.120",
    seeding: "0.120",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966"
  },
  {
    polygonName: "AEK Torup",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    plantDate: "9/26/24",
    baseline: "25/4/24",
    treePlanting: "0.423",
    regeneration: "0.120",
    seeding: "0.120",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966"
  },
  {
    polygonName: "Africas",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    plantDate: "9/26/24",
    baseline: "25/4/24",
    treePlanting: "0.423",
    regeneration: "0.120",
    seeding: "0.120",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966"
  },
  {
    polygonName: "Agoue Iboe",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    plantDate: "9/26/24",
    baseline: "25/4/24",
    treePlanting: "0.423",
    regeneration: "0.120",
    seeding: "0.120",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966"
  },
  {
    polygonName: "Agrajaya Baktitama",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    plantDate: "9/26/24",
    baseline: "25/4/24",
    treePlanting: "0.423",
    regeneration: "0.120",
    seeding: "0.120",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966"
  },
  {
    polygonName: "Agralsa",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    plantDate: "9/26/24",
    baseline: "25/4/24",
    treePlanting: "0.423",
    regeneration: "0.120",
    seeding: "0.120",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966"
  },
  {
    polygonName: "Africas",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    plantDate: "9/26/24",
    baseline: "25/4/24",
    treePlanting: "0.423",
    regeneration: "0.120",
    seeding: "0.120",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966"
  },
  {
    polygonName: "Agoue Iboe",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    plantDate: "9/26/24",
    baseline: "25/4/24",
    treePlanting: "0.423",
    regeneration: "0.120",
    seeding: "0.120",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966"
  },
  {
    polygonName: "Agrajaya Baktitama",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    plantDate: "9/26/24",
    baseline: "25/4/24",
    treePlanting: "0.423",
    regeneration: "0.120",
    seeding: "0.120",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966"
  },
  {
    polygonName: "Agralsa",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    plantDate: "9/26/24",
    baseline: "25/4/24",
    treePlanting: "0.423",
    regeneration: "0.120",
    seeding: "0.120",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966"
  },
  {
    polygonName: "ABA",
    siteName: "Palm Oil",
    status: "Draft",
    size: "7,473",
    plantDate: "9/26/24",
    baseline: "25/4/24",
    treePlanting: "0.423",
    regeneration: "0.120",
    seeding: "0.120",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966"
  },
  {
    polygonName: "Adison Thaochu A",
    siteName: "Palm Oil",
    status: "Submitted",
    size: "7,473",
    plantDate: "9/26/24",
    baseline: "25/4/24",
    treePlanting: "0.423",
    regeneration: "0.120",
    seeding: "0.120",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966"
  },
  {
    polygonName: "AEK Nabara Selatan",
    siteName: "Palm Oil",
    status: "Needs Info",
    size: "7,473",
    plantDate: "9/26/24",
    baseline: "25/4/24",
    treePlanting: "0.423",
    regeneration: "0.120",
    seeding: "0.120",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966"
  },
  {
    polygonName: "AEK Raso",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    plantDate: "9/26/24",
    baseline: "25/4/24",
    treePlanting: "0.423",
    regeneration: "0.120",
    seeding: "0.120",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966"
  },
  {
    polygonName: "AEK Torup",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    plantDate: "9/26/24",
    baseline: "25/4/24",
    treePlanting: "0.423",
    regeneration: "0.120",
    seeding: "0.120",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966"
  }
];

const DROPDOWN_OPTIONS = [
  {
    title: "Tree Cover Loss",
    value: "1"
  },
  {
    title: "Tree Cover Loss from Fire",
    value: "2"
  },
  {
    title: "Hectares Under Restoration By WWF EcoRegion",
    value: "3"
  },
  {
    title: "Hectares Under Restoration By Strategy",
    value: "4"
  },
  {
    title: "Hectares Under Restoration By Target Land Use System",
    value: "5"
  },
  {
    title: "Tree Count",
    value: "6"
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

const DataCard = ({ ...rest }: React.HTMLAttributes<HTMLDivElement>) => {
  const [tabActive, setTabActive] = useState(0);
  const [selected, setSelected] = useState<OptionValue[]>(["1"]);
  const mapFunctions = useMap();

  const POLYGONS = [
    { title: "Agrariala Palma", value: "1" },
    { title: "Agraisa", value: "2" },
    { title: "Agrajaya Batitama", value: "3" },
    { title: "Agoue Iboe", value: "4" },
    { title: "Africas", value: "5" },
    { title: "AEK Torup", value: "6" },
    { title: "AEK Raso", value: "7" },
    { title: "AEK Nabara Selatan", value: "8" },
    { title: "Adison Thaochu A", value: "9" },
    { title: "ABA", value: "10" }
  ];

  const indicatorDescription1 =
    "From the <b>23 August 2024</b> analysis, 12.2M out of 20M hectares are being restored. Of those, <b>Direct Seeding was the most prevalent strategy used with more 765,432ha</b>, followed by Tree Planting with 453,89ha and Assisted Natural Regeneration with 93,345ha.";
  const indicatorDescription2 =
    "The numbers and reports below display data related to Indicator 2: Hectares Under Restoration described in TerraFund’s MRV framework. Please refer to the linked MRV framework for details on how these numbers are sourced and verified.";

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

  const noDataMap = (
    <div className="absolute top-0 flex h-full w-full">
      <div className="relative flex w-[23vw] flex-col gap-3 p-6">
        <div className="absolute left-0 top-0 h-full w-full rounded-l-xl bg-white bg-opacity-20 backdrop-blur" />
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
          <div className="absolute left-0 top-0 h-full w-full rounded-xl bg-white bg-opacity-20 backdrop-blur" />
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

  return (
    <div className="-mx-4 h-[calc(100vh-200px)] overflow-auto px-4 pb-4">
      <div className="sticky top-[0px] z-[10] rounded-lg border border-grey-850 bg-white shadow-monitored" {...rest}>
        <div className="sticky top-[0px] z-[10] flex items-center justify-between rounded-t-lg bg-white px-6 pb-3 pt-6">
          <div className="flex items-center gap-2">
            <Icon name={IconNames.MONITORING_PROFILE} className="h-8 w-8" />
            <Dropdown
              options={DROPDOWN_OPTIONS}
              onChange={option => {
                setSelected(option);
              }}
              variant={VARIANT_DROPDOWN_SIMPLE}
              inputVariant="text-14-semibold"
              className="z-50"
              defaultValue={[DROPDOWN_OPTIONS[0].value]}
              optionsClassName="w-max z-50"
            />
          </div>

          <div className="flex items-center gap-2">
            <When condition={tabActive === 0}>
              <FilterSearchBox placeholder="Search" onChange={() => {}} variant={FILTER_SEARCH_MONITORING} />
              <Button variant="white-border" className="!h-[32px] !min-h-[32px] !w-8 p-0" onClick={() => {}}>
                <Icon name={IconNames.DOWNLOAD_PA} className="h-4 w-4 text-darkCustom" />
              </Button>
            </When>

            <Toggle items={toggleItems} onChangeActiveIndex={setTabActive} />
          </div>
        </div>
        <When condition={tabActive === 0}>
          <div className="relative w-full px-6 pb-6">
            <If condition={selected.includes("1") || selected.includes("2")}>
              <Then>
                <Table
                  columns={TABLE_COLUMNS}
                  data={TABLE_DATA}
                  variant={VARIANT_TABLE_MONITORED}
                  classNameWrapper="!overflow-visible"
                  visibleRows={50}
                  border={1}
                />
              </Then>
              <Else>
                <Table
                  columns={TABLE_COLUMNS_HECTARES}
                  data={TABLE_DATA}
                  variant={VARIANT_TABLE_MONITORED}
                  classNameWrapper="!overflow-visible"
                  visibleRows={50}
                />
              </Else>
            </If>
          </div>
        </When>
        <When condition={tabActive === 1}>
          <div className="relative flex w-full gap-8 px-6 pb-6 pt-2">
            <Dropdown
              containerClassName={classNames("absolute left-full -translate-x-full pr-6", {
                hidden: selected.includes("6")
              })}
              className="w-max"
              options={POLYGONS}
              defaultValue={["1"]}
              onChange={() => {}}
            />
            <div className="sticky top-[77px] flex h-[calc(100vh-320px)] w-1/4 min-w-[25%] flex-col gap-3">
              <Text
                variant={"text-14-semibold"}
                className="w-fit border-b-2 border-neutral-450 pb-1.5 text-blueCustom-900"
              >
                Indicator Description
              </Text>
              <div className="flex min-h-0 flex-col gap-3 overflow-auto pr-1">
                <Text variant={"text-14-light"} className="text-darkCustom-150" containHtml>
                  {indicatorDescription1}
                </Text>
                <Text variant={"text-14-light"} className="text-darkCustom-150" containHtml>
                  {indicatorDescription2}
                </Text>
              </div>
            </div>
            <When condition={selected.includes("1")}>
              <img src="/images/monitoring-graph-2.png" alt="" className="w-[73%] object-contain" />
            </When>
            <When condition={selected.includes("2") || selected.includes("2")}>
              <img src="/images/monitoring-graph-2.png" alt="" className="w-[73%] object-contain" />
            </When>
            <When condition={selected.includes("3")}>
              <img src="/images/monitoring-graph-3.png" alt="" className="w-[73%] object-contain" />
            </When>
            <When condition={selected.includes("4")}>
              <img src="/images/monitoring-graph-4.png" alt="" className="w-[73%] object-contain" />
            </When>
            <When condition={selected.includes("5")}>
              <div className="w-[73%]">
                <GraphicIconDashboard
                  data={DUMMY_DATA_TARGET_LAND_USE_TYPES_REPRESENTED.graphicTargetLandUseTypes}
                  maxValue={90}
                />
              </div>
            </When>
            <When condition={selected.includes("6")}>{noDataGraph}</When>
          </div>
        </When>
        <When condition={tabActive === 2}>
          <div className="relative h-[calc(100vh-295px)] w-full">
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
  );
};

export default DataCard;
