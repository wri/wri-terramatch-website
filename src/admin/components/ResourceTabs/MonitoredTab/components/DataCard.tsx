import { ColumnDef, RowData } from "@tanstack/react-table";
import React, { useState } from "react";
import { When } from "react-if";

import CustomChipField from "@/admin/components/Fields/CustomChipField";
import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_DROPDOWN_SIMPLE } from "@/components/elements/Inputs/Dropdown/DropdownVariant";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_LEFT_HALF_BOTTOM } from "@/components/elements/Menu/MenuVariant";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_MONITORED } from "@/components/elements/Table/TableVariants";
import FilterSearchBox from "@/components/elements/TableFilters/Inputs/FilterSearchBox";
import { FILTER_SEARCH_MONITORING } from "@/components/elements/TableFilters/Inputs/FilterSearchBoxVariants";
import Text from "@/components/elements/Text/Text";
import Toggle, { TogglePropsItem } from "@/components/elements/Toggle/Toggle";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

interface TableData {
  polygonName: string;
  size: string;
  siteName: string;
  status: string;
  dateRun2024: string;
  "2024-2015": string;
  "2024-2016": string;
  "2024-2017": string;
  "2024-2018": string;
  "2024-2019": string;
  "2024-2020": string;
  "2024-2021": string;
  "2024-2022": string;
  "2024-2023": string;
  "2024-2024": string;
  dateRun2025: string;
  "2025-2016": string;
  "2025-2017": string;
  "2025-2018": string;
  "2025-2019": string;
  "2025-2020": string;
  "2025-2021": string;
  "2025-2022": string;
  "2025-2023": string;
  "2025-2024": string;
  "2025-2025": string;
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
    id: "32",
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
    header: "",
    columns: [
      { accessorKey: "polygonName", header: "Polygon Name", meta: { sticky: true, left: 0 } },
      {
        accessorKey: "size",
        header: "Size (ha)",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
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
      }
    ]
  },
  {
    id: "analysis2024",
    header: "2024 Analysis",
    columns: [
      {
        accessorKey: "dateRun2024",
        header: "Date Run",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      },
      {
        accessorKey: "2024-2015",
        header: "2015",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      },
      {
        accessorKey: "2024-2016",
        header: "2016",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      },
      {
        accessorKey: "2024-2017",
        header: "2017",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      },
      {
        accessorKey: "2024-2018",
        header: "2018",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      },
      {
        accessorKey: "2024-2019",
        header: "2019",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      },
      {
        accessorKey: "2024-2020",
        header: "2020",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      },
      {
        accessorKey: "2024-2021",
        header: "2021",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      },
      {
        accessorKey: "2024-2022",
        header: "2022",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      },
      {
        accessorKey: "2024-2023",
        header: "2023",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      },
      {
        accessorKey: "2024-2024",
        header: "2024",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      }
    ]
  },
  {
    id: "analysis2025",
    header: "2025 Analysis",
    columns: [
      {
        accessorKey: "dateRun2025",
        header: "Date Run",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      },
      {
        accessorKey: "2025-2016",
        header: "2016 ",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      },
      {
        accessorKey: "2025-2017",
        header: "2017",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      },
      {
        accessorKey: "2025-2018",
        header: "2018",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      },
      {
        accessorKey: "2025-2019",
        header: "2019",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      },
      {
        accessorKey: "2025-2020",
        header: "2020",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      },
      {
        accessorKey: "2025-2021",
        header: "2021",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      },
      {
        accessorKey: "2025-2022",
        header: "2022",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      },
      {
        accessorKey: "2025-2023",
        header: "2023",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      },
      {
        accessorKey: "2025-2024",
        header: "2024",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      },
      {
        accessorKey: "2025-2025",
        header: "2025",
        cell: (props: any) => (
          <Text variant="text-10" className="text-right">
            {props.getValue()}
          </Text>
        )
      }
    ]
  },
  {
    id: "moreInfo",
    header: "",
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
        )
      }
    ]
  }
];

const TABLE_DATA = [
  {
    polygonName: "ABA",
    siteName: "Palm Oil",
    status: "Draft",
    size: "7,473",
    dateRun2024: "9/26/24",
    dateRun2025: "10/25/24",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966",
    "2025-2016": "0.966",
    "2025-2017": "0.655",
    "2025-2018": "0.208",
    "2025-2019": "0.654",
    "2025-2020": "0.466",
    "2025-2021": "0.151",
    "2025-2022": "0.385",
    "2025-2023": "0.457",
    "2025-2024": "0.966",
    "2025-2025": "0.966"
  },
  {
    polygonName: "Adison Thaochu A",
    siteName: "Palm Oil",
    status: "Submitted",
    size: "7,473",
    dateRun2024: "9/26/24",
    dateRun2025: "10/25/24",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966",
    "2025-2016": "0.966",
    "2025-2017": "0.655",
    "2025-2018": "0.208",
    "2025-2019": "0.654",
    "2025-2020": "0.466",
    "2025-2021": "0.151",
    "2025-2022": "0.385",
    "2025-2023": "0.457",
    "2025-2024": "0.966",
    "2025-2025": "0.966"
  },
  {
    polygonName: "AEK Nabara Selatan",
    siteName: "Palm Oil",
    status: "Needs Info",
    size: "7,473",
    dateRun2024: "9/26/24",
    dateRun2025: "10/25/24",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966",
    "2025-2016": "0.966",
    "2025-2017": "0.655",
    "2025-2018": "0.208",
    "2025-2019": "0.654",
    "2025-2020": "0.466",
    "2025-2021": "0.151",
    "2025-2022": "0.385",
    "2025-2023": "0.457",
    "2025-2024": "0.966",
    "2025-2025": "0.966"
  },
  {
    polygonName: "AEK Raso",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    dateRun2024: "9/26/24",
    dateRun2025: "10/25/24",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966",
    "2025-2016": "0.966",
    "2025-2017": "0.655",
    "2025-2018": "0.208",
    "2025-2019": "0.654",
    "2025-2020": "0.466",
    "2025-2021": "0.151",
    "2025-2022": "0.385",
    "2025-2023": "0.457",
    "2025-2024": "0.966",
    "2025-2025": "0.966"
  },
  {
    polygonName: "AEK Torup",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    dateRun2024: "9/26/24",
    dateRun2025: "10/25/24",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966",
    "2025-2016": "0.966",
    "2025-2017": "0.655",
    "2025-2018": "0.208",
    "2025-2019": "0.654",
    "2025-2020": "0.466",
    "2025-2021": "0.151",
    "2025-2022": "0.385",
    "2025-2023": "0.457",
    "2025-2024": "0.966",
    "2025-2025": "0.966"
  },
  {
    polygonName: "Africas",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    dateRun2024: "9/26/24",
    dateRun2025: "10/25/24",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966",
    "2025-2016": "0.966",
    "2025-2017": "0.655",
    "2025-2018": "0.208",
    "2025-2019": "0.654",
    "2025-2020": "0.466",
    "2025-2021": "0.151",
    "2025-2022": "0.385",
    "2025-2023": "0.457",
    "2025-2024": "0.966",
    "2025-2025": "0.966"
  },
  {
    polygonName: "Agoue Iboe",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    dateRun2024: "9/26/24",
    dateRun2025: "10/25/24",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966",
    "2025-2016": "0.966",
    "2025-2017": "0.655",
    "2025-2018": "0.208",
    "2025-2019": "0.654",
    "2025-2020": "0.466",
    "2025-2021": "0.151",
    "2025-2022": "0.385",
    "2025-2023": "0.457",
    "2025-2024": "0.966",
    "2025-2025": "0.966"
  },
  {
    polygonName: "Agrajaya Baktitama",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    dateRun2024: "9/26/24",
    dateRun2025: "10/25/24",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966",
    "2025-2016": "0.966",
    "2025-2017": "0.655",
    "2025-2018": "0.208",
    "2025-2019": "0.654",
    "2025-2020": "0.466",
    "2025-2021": "0.151",
    "2025-2022": "0.385",
    "2025-2023": "0.457",
    "2025-2024": "0.966",
    "2025-2025": "0.966"
  },
  {
    polygonName: "Agralsa",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    dateRun2024: "9/26/24",
    dateRun2025: "10/25/24",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966",
    "2025-2016": "0.966",
    "2025-2017": "0.655",
    "2025-2018": "0.208",
    "2025-2019": "0.654",
    "2025-2020": "0.466",
    "2025-2021": "0.151",
    "2025-2022": "0.385",
    "2025-2023": "0.457",
    "2025-2024": "0.966",
    "2025-2025": "0.966"
  }
];

const DROPDOWN_OPTIONS = [
  {
    title: "Tree Cover TTC",
    value: "Tree Cover TTC"
  },
  {
    title: "Tree Cover Loss",
    value: "Tree Cover Loss"
  },
  {
    title: "Tree Cover Loss from Fire",
    value: "Tree Cover Loss from Fire"
  },
  {
    title: "Restoration by  EcoRegion",
    value: "Restoration by  EcoRegion"
  },
  {
    title: "Restoration by Strategy",
    value: "Restoration by Strategy"
  },
  {
    title: "Restoration by Land Use",
    value: "Restoration by Land Use"
  },
  {
    title: "Tree Count",
    value: "Tree Count"
  },
  {
    title: "Early Tree Verificaiton",
    value: "Early Tree Verificaiton"
  },
  {
    title: "Field Monitoring",
    value: "Field Monitoring"
  },
  {
    title: "MSU Carbon",
    value: "MSU Carbon"
  }
];

const toggleItems: TogglePropsItem[] = [
  {
    key: "dashboard",
    render: (
      <Text variant="text-14" className="py-1">
        Table
      </Text>
    )
  },
  {
    key: "table",
    render: (
      <Text variant="text-14" className="py-1">
        Graph
      </Text>
    )
  },
  {
    key: "table",
    render: (
      <Text variant="text-14" className="py-1">
        Map
      </Text>
    )
  }
];

const DataCard = ({ ...rest }: React.HTMLAttributes<HTMLDivElement>) => {
  const [tabActive, setTabActive] = useState(0);

  // const dataLegend = [
  //   { label: "Agrariala Palma", percentage: "1.0", color: "#AA57FD" },
  //   { label: "Agraisa", percentage: "0.9", color: "#577EFD" },
  //   { label: "Agrajaya Batitama", percentage: "0.8", color: "#57C2FD" },
  //   { label: "Agoue Iboe", percentage: "0.7", color: "#75A338" },
  //   { label: "Africas", percentage: "0.6", color: "#9F7830" },
  //   { label: "AEK Torup", percentage: "0.5", color: "#7471AD" },
  //   { label: "AEK Raso", percentage: "0.4", color: "#CB6527" },
  //   { label: "AEK Nabara Selatan", percentage: "0.3", color: "#DDAB3B" },
  //   { label: "Adison Thaochu A", percentage: "0.2", color: "#489B7B" },
  //   { label: "ABA", percentage: "0.1", color: "#D54789" }
  // ];

  return (
    <div
      {...rest}
      className="flex max-w-5xl flex-col gap-3 rounded-lg border border-grey-850 bg-white shadow-monitored"
    >
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          <Icon name={IconNames.MONITORING_PROFILE} className="h-8 w-8" />
          <Dropdown
            options={DROPDOWN_OPTIONS}
            onChange={() => {}}
            variant={VARIANT_DROPDOWN_SIMPLE}
            inputVariant="text-14-semibold"
            defaultValue={[DROPDOWN_OPTIONS[0].value]}
          />
        </div>

        <div className="flex items-center gap-2">
          <FilterSearchBox placeholder="Search" onChange={() => {}} variant={FILTER_SEARCH_MONITORING} />
          <Button variant="white-border" className="h-8 !w-8 p-0" onClick={() => {}}>
            <Icon name={IconNames.DOWNLOAD} className="h-[10px] w-[10px]" />
          </Button>
          <Toggle items={toggleItems} onChangeActiveIndex={setTabActive} />
        </div>
      </div>
      <When condition={tabActive === 0}>
        <div className="w-full px-4">
          <Table columns={TABLE_COLUMNS} data={TABLE_DATA} variant={VARIANT_TABLE_MONITORED} />
        </div>
      </When>
      <When condition={tabActive === 1}>
        <div className="w-full px-4 pb-4">
          <Table columns={TABLE_COLUMNS} data={TABLE_DATA} variant={VARIANT_TABLE_MONITORED} />
        </div>
      </When>
      <When condition={tabActive === 2}>
        <div className="w-full">
          <Table columns={TABLE_COLUMNS} data={TABLE_DATA} variant={VARIANT_TABLE_MONITORED} />
        </div>
      </When>
    </div>
  );
};

export default DataCard;
