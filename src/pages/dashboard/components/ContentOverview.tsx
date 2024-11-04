import { ColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import React from "react";

import Button from "@/components/elements/Button/Button";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import Table from "@/components/elements/Table/Table";
import {
  VARIANT_TABLE_DASHBOARD_COUNTRIES,
  VARIANT_TABLE_DASHBOARD_COUNTRIES_MODAL
} from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";
import ModalExpand from "@/components/extensive/Modal/ModalExpand";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { CHART_TYPES } from "@/constants/dashboardConsts";
import { useModalContext } from "@/context/modal.provider";
import { DashboardGetProjectsData } from "@/generated/apiSchemas";
import { HectaresUnderRestorationData } from "@/utils/dashboardUtils";

import {
  HECTARES_UNDER_RESTORATION_SECTION_TOOLTIP,
  MAP_TOOLTIP,
  RESTORATION_STRATEGIES_REPRESENTED_TOOLTIP,
  TARGET_LAND_USE_TYPES_REPRESENTED_TOOLTIP,
  TOTAL_HECTARES_UNDER_RESTORATION_TOOLTIP,
  TOTAL_NUMBER_OF_SITES_TOOLTIP
} from "../constants/tooltips";
import SecDashboard from "./SecDashboard";
import TooltipGridMap from "./TooltipGridMap";

interface RowData {
  uuid: string;
}

interface ContentOverviewProps<TData> {
  dataTable: TData[];
  columns: ColumnDef<TData>[];
  titleTable: string;
  textTooltipTable?: string;
  centroids?: DashboardGetProjectsData[];
  polygonsData?: any;
  listViewProjects?: any;
  dataHectaresUnderRestoration: HectaresUnderRestorationData;
  showImagesButton?: boolean;
}

const ContentOverview = (props: ContentOverviewProps<RowData>) => {
  const {
    dataTable: data,
    columns,
    titleTable,
    textTooltipTable,
    centroids,
    polygonsData,
    listViewProjects,
    dataHectaresUnderRestoration,
    showImagesButton
  } = props;
  const t = useT();
  const modalMapFunctions = useMap();
  const dashboardMapFunctions = useMap();
  const role = "";
  const { openModal, closeModal } = useModalContext();

  const ModalMap = () => {
    openModal(
      "modalExpand",
      <ModalExpand id="modalExpand" title={t("MAP")} closeModal={closeModal} popUpContent={MAP_TOOLTIP}>
        <div className="shadow-lg relative w-full flex-1 overflow-hidden rounded-lg border-4 border-white">
          <MapContainer showLegend={false} mapFunctions={modalMapFunctions} className="!h-full" isDashboard={"modal"} />

          <TooltipGridMap label="Angola" learnMore={true} />
          <div className="absolute left-6 top-6 z-10 rounded-lg bg-[#1F121259] px-2 py-1 text-center text-white backdrop-blur-md">
            <Text variant="text-12-light">{t("PROGRAMME VIEW")}</Text>
          </div>

          <div className="absolute bottom-6 left-6 grid gap-2 rounded-lg bg-white px-4 py-2">
            <div className="flex gap-2">
              <Icon name={IconNames.IC_LEGEND_MAP} className="h-4.5 w-4.5 text-tertiary-800" />
              <Text variant="text-12" className="text-darkCustom">
                {t("Non-Profit Projects (32)")}
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Icon name={IconNames.IC_LEGEND_MAP} className="h-4.5 w-4.5 text-blue-50" />
              <Text variant="text-12" className="text-darkCustom">
                {t("Enterprise Projects (457)")}
              </Text>
            </div>
          </div>
        </div>
      </ModalExpand>
    );
  };

  const ModalTable = () => {
    openModal(
      "modalExpand",
      <ModalExpand id="modalExpand" title={titleTable} popUpContent={textTooltipTable} closeModal={closeModal}>
        <div className="w-full px-6">
          <Table
            columns={columns.map(column => {
              column.header === "Hectares" ? (column.header = "Restoration Hectares") : column.header;
              return {
                ...column,
                enableSorting: Boolean(column.header?.length)
              };
            })}
            data={data}
            variant={VARIANT_TABLE_DASHBOARD_COUNTRIES_MODAL}
            hasPagination={true}
            invertSelectPagination={true}
            initialTableState={{ pagination: { pageSize: 10 } }}
          />
        </div>
      </ModalExpand>
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-[730px] small:w-1/2 small:max-w-max">
      <PageRow className="w-full gap-4 p-0">
        <div className="shadow-lg relative w-full rounded-lg border-4 border-white">
          <Button
            className="absolute right-5 top-6 z-10"
            variant="white-button-map"
            onClick={() => {
              ModalMap();
            }}
          >
            <div className="flex items-center gap-1">
              <Icon name={IconNames.EXPAND} className="h-[14px] w-[14px]" />
              <Text variant="text-16-bold" className="capitalize text-blueCustom-900">
                {t("Expand")}
              </Text>
            </div>
          </Button>
          <MapContainer
            id="dashboard"
            showLegend={false}
            mapFunctions={dashboardMapFunctions}
            isDashboard={"dashboard"}
            className="custom-popup-close-button"
            centroids={centroids}
            showPopups={true}
            polygonsData={polygonsData as Record<string, string[]>}
            listViewProjects={listViewProjects}
            role={role}
            showImagesButton={showImagesButton}
          />
          <div className="absolute left-6 top-6 rounded-lg bg-[#1F121259] px-2 py-1 text-center text-white backdrop-blur-md">
            <Text variant="text-12-light">{t("PROGRAMME VIEW")}</Text>
          </div>

          <div className="absolute bottom-8 left-6 grid gap-2 rounded-lg bg-white px-4 py-2">
            <div className="flex gap-2">
              <Icon name={IconNames.IC_LEGEND_MAP} className="h-4.5 w-4.5 text-tertiary-800" />
              <Text variant="text-12" className="text-darkCustom">
                {t("Non-Profit Projects (32)")}
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Icon name={IconNames.IC_LEGEND_MAP} className="h-4.5 w-4.5 text-blue-50" />
              <Text variant="text-12" className="text-darkCustom">
                {t("Enterprise Projects (457)")}
              </Text>
            </div>
          </div>
        </div>

        <PageCard
          className="border-0 px-4 py-6"
          classNameSubTitle="mt-4"
          gap={8}
          subtitleMore={true}
          title={t("Hectares Under Restoration")}
          variantSubTitle="text-14-light"
          tooltip={t(HECTARES_UNDER_RESTORATION_SECTION_TOOLTIP)}
          iconClassName="h-3.5 w-3.5 text-darkCustom lg:h-5 lg:w-5"
          subtitle={t(
            `The numbers and reports below display data related to Indicator 2: Hectares Under Restoration described in <span class="underline">TerraFund’s MRV framework</span>. Please refer to the linked MRV framework for details on how these numbers are sourced and verified.`
          )}
          widthTooltip="w-52 lg:w-64"
        >
          <div className="grid w-3/4 auto-cols-max grid-flow-col gap-12 divide-x divide-grey-1000">
            <SecDashboard
              title={t("Total Hectares Under Restoration")}
              data={{ value: dataHectaresUnderRestoration?.totalSection.totalHectaresRestored }}
              classNameBody="w-full place-content-center"
              tooltip={t(TOTAL_HECTARES_UNDER_RESTORATION_TOOLTIP)}
            />
            <SecDashboard
              title={t("Total Number Of Sites")}
              data={{ value: dataHectaresUnderRestoration?.totalSection.numberOfSites }}
              className="pl-12"
              classNameBody="w-full place-content-center"
              tooltip={t(TOTAL_NUMBER_OF_SITES_TOOLTIP)}
            />
          </div>
          <SecDashboard
            title={t("Restoration Strategies Represented")}
            data={{}}
            chartType={CHART_TYPES.simpleBarChart}
            dataForChart={dataHectaresUnderRestoration.restorationStrategiesRepresented}
            tooltip={t(RESTORATION_STRATEGIES_REPRESENTED_TOOLTIP)}
          />
          <SecDashboard
            title={t("Target Land Use Types Represented")}
            chartType={CHART_TYPES.barChart}
            data={dataHectaresUnderRestoration}
            tooltip={t(TARGET_LAND_USE_TYPES_REPRESENTED_TOOLTIP)}
          />
        </PageCard>

        <PageCard
          className="border-0 px-4 py-6"
          classNameSubTitle="mt-4"
          gap={6}
          subtitleMore={true}
          title={t(titleTable)}
          tooltip={textTooltipTable}
          tooltipTrigger="click"
          iconClassName="h-3.5 w-3.5 text-darkCustom lg:h-5 lg:w-5"
          headerChildren={
            <Button
              variant="white-border"
              onClick={() => {
                ModalTable();
              }}
            >
              <div className="flex items-center gap-1">
                <Icon name={IconNames.EXPAND} className="h-[14px] w-[14px]" />
                <Text variant="text-16-bold" className="capitalize text-blueCustom-900">
                  {t("See All")}
                </Text>
              </div>
            </Button>
          }
        >
          <Table visibleRows={5} columns={columns} data={data} variant={VARIANT_TABLE_DASHBOARD_COUNTRIES} />
        </PageCard>
      </PageRow>
    </div>
  );
};

export default ContentOverview;
