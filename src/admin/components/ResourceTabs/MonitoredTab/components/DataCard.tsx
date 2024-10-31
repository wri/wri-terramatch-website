import { ColumnDef, RowData } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_DROPDOWN_SIMPLE } from "@/components/elements/Inputs/Dropdown/DropdownVariant";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import MapContainer from "@/components/elements/Map-mapbox/Map";
import Table from "@/components/elements/Table/Table";
import {
  VARIANT_TABLE_DASHBOARD_COUNTRIES_MODAL,
  VARIANT_TABLE_MONITORED
} from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalExpand from "@/components/extensive/Modal/ModalExpand";
import { useModalContext } from "@/context/modal.provider";

interface TableData {
  polygonName: string;
  site: string;
  year: string;
  cover: string;
  confidence: string;
  phase: string;
}

export interface DataStructure extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  tooltipContent: string;
  tableData: TableData[];
}

const TABLE_COLUMNS: ColumnDef<RowData>[] = [
  {
    id: "mainInfo",
    header: "",
    columns: [
      { accessorKey: "polygonName", header: "Polygon Name" },
      { accessorKey: "size", header: "Size (ha)" },
      { accessorKey: "siteName", header: "Site Name" },
      { accessorKey: "status", header: "Status" }
    ]
  },
  {
    id: "analysis2024",
    header: "2024 Analysis",
    columns: [
      { accessorKey: "dateRun2024", header: "Date Run" },
      { accessorKey: "2024-2015", header: "2015" },
      { accessorKey: "2024-2016", header: "2016" },
      { accessorKey: "2024-2017", header: "2017" },
      { accessorKey: "2024-2018", header: "2018" },
      { accessorKey: "2024-2019", header: "2019" },
      { accessorKey: "2024-2020", header: "2020" },
      { accessorKey: "2024-2021", header: "2021" },
      { accessorKey: "2024-2022", header: "2022" },
      { accessorKey: "2024-2023", header: "2023" },
      { accessorKey: "2024-2024", header: "2024" }
    ]
  },
  {
    id: "analysis2025",
    header: "2025 Analysis",
    columns: [
      { accessorKey: "dateRun2025", header: "Date Run" },
      { accessorKey: "2025-2016", header: "2016 " }
    ]
  }
];

const DROPDOWN_OPTIONS = [
  {
    title: "2024",
    value: "2024"
  },
  {
    title: "2023",
    value: "2023"
  },
  {
    title: "2022",
    value: "2022"
  }
];

const DataCard = ({
  data,
  isCardsTable,
  ...rest
}: { data: DataStructure; isCardsTable: boolean } & React.HTMLAttributes<HTMLDivElement>) => {
  const { label, tooltipContent, tableData } = data;
  const [isTable, setIsTable] = useState(isCardsTable);
  const t = useT();
  const { openModal, closeModal } = useModalContext();
  const modalMapFunctions = useMap();

  const ModalTable = () => {
    openModal(
      "modalExpand",
      <ModalExpand id="modalExpand" title={"Table"} closeModal={closeModal}>
        <div className="h-full w-full px-6 pb-6">
          <Table
            columns={TABLE_COLUMNS.map(column => {
              column.header === "Hectares" ? (column.header = "Restoration Hectares") : column.header;
              return {
                ...column,
                enableSorting: Boolean(column.header?.length)
              };
            })}
            data={tableData}
            variant={VARIANT_TABLE_DASHBOARD_COUNTRIES_MODAL}
          />
        </div>
      </ModalExpand>
    );
  };

  const ModalMap = () => {
    openModal(
      "modalExpand",
      <ModalExpand id="modalExpand" title={"Map"} closeModal={closeModal}>
        <div className="shadow-lg relative w-full flex-1 overflow-hidden rounded-lg border-4 border-white">
          <MapContainer showLegend={false} mapFunctions={modalMapFunctions} className="!h-full" isDashboard={"modal"} />
        </div>
      </ModalExpand>
    );
  };

  useEffect(() => {
    setIsTable(isCardsTable);
  }, [isCardsTable]);

  return (
    <div
      {...rest}
      className={classNames("flex w-full gap-3", {
        "rounded-lg border border-grey-850 bg-neutral-50 shadow": !isTable
      })}
    >
      <When condition={!isTable}>
        <div className="flex flex-col gap-2 py-4 pl-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Text variant={"text-16-semibold"}>{label}</Text>
              <ToolTip content={t(tooltipContent)}>
                <Icon name={IconNames.IC_INFO} className="w-3.5" />
              </ToolTip>
            </div>
            <div className="flex items-center gap-1">
              <Text variant={"text-12-light"} className="text-black">
                {t("10-Year Retrospective from:")}
              </Text>
              <Dropdown
                options={DROPDOWN_OPTIONS}
                onChange={() => {}}
                variant={VARIANT_DROPDOWN_SIMPLE}
                inputVariant="text-14-semibold"
                defaultValue={[DROPDOWN_OPTIONS[0].value]}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="!h-min !min-h-min !rounded-lg !py-1"
              variant="white-border"
              onClick={() => {
                ModalTable();
              }}
            >
              <div className="flex items-center gap-1">
                <Icon name={IconNames.TABLE} className="h-[14px] w-[14px]" />
                <Text variant="text-14-bold" className="capitalize text-blueCustom-900">
                  Table
                </Text>
              </div>
            </Button>
            <Button
              className="!h-min !min-h-min !rounded-lg !py-1"
              variant="white-border"
              onClick={() => {
                ModalMap();
              }}
            >
              <div className="flex items-center gap-1">
                <Icon name={IconNames.MAP} className="h-[14px] w-[14px]" />
                <Text variant="text-14-bold" className="capitalize text-blueCustom-900">
                  Map
                </Text>
              </div>
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            <Text variant="text-14-light">• HTTP 4XX Errors</Text>
            <div className="flex items-center gap-1">
              <Text variant="text-14-bold">108K</Text>
              <Text variant="text-14-light">12%</Text>
            </div>
          </div>
        </div>
        <div className="h-[inherit] w-[1px] bg-grey-850" />
        <div className="flex items-center gap-1 py-4 pr-4">
          <div className="flex flex-[4] flex-col gap-2">
            <img src="/Images/graphic-8.svg" alt="graph" />
            <div className="grid w-full grid-cols-4 gap-1 pl-3">
              <Text variant="text-10-light" className="flex items-center gap-1 whitespace-nowrap text-black">
                <div className="h-2 w-2 rounded-sm bg-[#D54789]" />
                Adison Thaochu A
              </Text>
              <Text variant="text-10-light" className="flex items-center gap-1 whitespace-nowrap text-black">
                <div className="h-2 w-2 rounded-sm bg-[#489B7B]" />
                AEK Nabara Selatan
              </Text>
              <Text variant="text-10-light" className="flex items-center gap-1 whitespace-nowrap text-black">
                <div className="h-2 w-2 rounded-sm bg-[#DDAB3B]" />
                AEK Raso
              </Text>
              <Text variant="text-10-light" className="flex items-center gap-1 whitespace-nowrap text-black">
                <div className="h-2 w-2 rounded-sm bg-[#CB6527]" />
                AEK Torup
              </Text>
              <Text variant="text-10-light" className="flex items-center gap-1 whitespace-nowrap text-black">
                <div className="h-2 w-2 rounded-sm bg-[#7471AD]" />
                Africas
              </Text>
              <Text variant="text-10-light" className="flex items-center gap-1 whitespace-nowrap text-black">
                <div className="h-2 w-2 rounded-sm bg-[#9F7830]" />
                Agoue Iboe
              </Text>
              <Text variant="text-10-light" className="flex items-center gap-1 whitespace-nowrap text-black">
                <div className="h-2 w-2 rounded-sm bg-[#75A338]" />
                Agrajaya Baktitama
              </Text>
              <Text variant="text-10-light" className="flex items-center gap-1 whitespace-nowrap text-black">
                <div className="h-2 w-2 rounded-sm bg-[#57C2FD]" />
                Agralsa
              </Text>
            </div>
            {/* <div className="flex items-center">
            <div className="flex flex-col items-center justify-center flex-1 border-r-2 border-grey-950">
              <Text variant={"text-12"} className="text-grey-600">
                1YR AVG
              </Text>
              <Text variant={"text-14"}>3,020</Text>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 border-r-2 border-grey-950">
              <Text variant={"text-12"} className="text-grey-600">
                3YR AVG
              </Text>
              <Text variant={"text-14"}>5,100</Text>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 border-r-2 border-grey-950">
              <Text variant={"text-12"} className="text-grey-600">
                5YR AVG
              </Text>
              <Text variant={"text-14"}>6,800</Text>
            </div>
            <div className="flex flex-col items-center justify-center flex-1">
              <Text variant={"text-12"} className="text-grey-600">
                10YR AVG
              </Text>
              <Text variant={"text-14"}>8,450</Text>
            </div>
          </div> */}
          </div>
        </div>
      </When>
      <When condition={isTable}>
        <Table columns={TABLE_COLUMNS} data={tableData} variant={VARIANT_TABLE_MONITORED} hasPagination={true} />
      </When>
    </div>
  );
};

export default DataCard;
