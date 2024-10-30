import { ColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import React from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_DROPDOWN_SIMPLE } from "@/components/elements/Inputs/Dropdown/DropdownVariant";
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

const TABLE_COLUMNS: ColumnDef<TableData>[] = [
  {
    header: "Polygon Name",
    accessorKey: "polygonName"
  },
  {
    header: "Site",
    accessorKey: "site"
  },
  {
    header: "Year",
    accessorKey: "year"
  },
  {
    header: "% Cover",
    accessorKey: "cover",
    cell: () => {
      return <img src={"/images/graphic-1.png"} alt="graphic" className="h-3" />;
    },
    enableSorting: false
  },
  {
    header: () => (
      <>
        Confi-
        <br />
        dence
      </>
    ),
    accessorKey: "confidence"
  },
  {
    header: "Phase",
    accessorKey: "phase"
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

const DataCard = ({ data, ...rest }: { data: DataStructure } & React.HTMLAttributes<HTMLDivElement>) => {
  const { label, tooltipContent, tableData } = data;
  const t = useT();
  const { openModal, closeModal } = useModalContext();
  const ModalTable = () => {
    openModal(
      "modalExpand",
      <ModalExpand id="modalExpand" title={"Table"} closeModal={closeModal}>
        <div className="w-full px-6">
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

  return (
    <div {...rest} className="flex w-full flex-col rounded-lg border border-grey-850 bg-neutral-50 p-4 shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Icon name={IconNames.MONITORING_PROFILE} className="h-8 w-8" />
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
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="mb-4"
            variant="white-border"
            onClick={() => {
              ModalTable();
            }}
          >
            <div className="flex items-center gap-1">
              <Icon name={IconNames.EXPAND} className="h-[14px] w-[14px]" />
              <Text variant="text-16-bold" className="capitalize text-blueCustom-900">
                {t("Expand")}
              </Text>
            </div>
          </Button>
          <Button className="mb-4" variant="white-border" onClick={() => {}}>
            <div className="flex items-center gap-1">
              <Icon name={IconNames.EXPAND} className="h-[14px] w-[14px]" />
              <Text variant="text-16-bold" className="capitalize text-blueCustom-900">
                {t("Table")}
              </Text>
            </div>
          </Button>
          <Button className="mb-4" variant="white-border" onClick={() => {}}>
            <div className="flex items-center gap-1">
              <Icon name={IconNames.MAP} className="h-[14px] w-[14px]" />
              <Text variant="text-16-bold" className="capitalize text-blueCustom-900">
                {t("Map")}
              </Text>
            </div>
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-1">
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
            <div className="flex flex-1 flex-col items-center justify-center border-r-2 border-grey-950">
              <Text variant={"text-12"} className="text-grey-600">
                1YR AVG
              </Text>
              <Text variant={"text-14"}>3,020</Text>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center border-r-2 border-grey-950">
              <Text variant={"text-12"} className="text-grey-600">
                3YR AVG
              </Text>
              <Text variant={"text-14"}>5,100</Text>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center border-r-2 border-grey-950">
              <Text variant={"text-12"} className="text-grey-600">
                5YR AVG
              </Text>
              <Text variant={"text-14"}>6,800</Text>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center">
              <Text variant={"text-12"} className="text-grey-600">
                10YR AVG
              </Text>
              <Text variant={"text-14"}>8,450</Text>
            </div>
          </div> */}
        </div>
        <When condition={false}>
          <Table columns={TABLE_COLUMNS} data={tableData} variant={VARIANT_TABLE_MONITORED} />
        </When>
      </div>
    </div>
  );
};

export default DataCard;
