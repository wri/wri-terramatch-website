import { ColumnDef, RowData } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import React from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import ImpactStoryCard from "@/components/elements/Cards/DashboardCard/ImpactStoryCard";
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
import { useModalContext } from "@/context/modal.provider";
import { DashboardGetProjectsData } from "@/generated/apiSchemas";

import {
  RESTORATION_STRATEGIES_REPRESENTED,
  TARGET_LAND_USE_TYPES_REPRESENTED,
  TOTAL_HECTARES_UNDER_RESTORATION,
  TOTAL_NUMBER_OF_SITES
} from "../mockedData/dashboard";
import SecDashboard from "./SecDashboard";
import TooltipGridMap from "./TooltipGridMap";

interface ImpactStoryCardProps {
  id: string;
  by: string;
  date: string;
  description: string;
  image: string;
  title: string;
}

interface ContentOverviewProps<TData> {
  dataTable: TData[];
  columns: ColumnDef<TData>[];
  dataImpactStories?: ImpactStoryCardProps[];
  titleTable: string;
  textTooltipTable?: string;
  centroids?: DashboardGetProjectsData[];
}

const ContentOverview = (props: ContentOverviewProps<RowData>) => {
  const { dataTable: data, columns, dataImpactStories = [], titleTable, textTooltipTable, centroids } = props;
  const t = useT();
  const modalMapFunctions = useMap();
  const dashboardMapFunctions = useMap();

  const { openModal, closeModal } = useModalContext();
  const ModalMap = () => {
    openModal(
      "modalExpand",
      <ModalExpand
        id="modalExpand"
        title={t("MAP")}
        closeModal={closeModal}
        popUpContent="Click on a country or project to view additional information. Zooming in on the map will display satellite imagery. Those with access to individual project pages can see approved polygons and photos."
      >
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
        <When condition={dataImpactStories?.length !== 0}>
          <PageCard
            title={t("IMPACT STORIES")}
            gap={4}
            tooltip={t(
              "Short project success stories will be accessible by early 2025 through the relevant project pages."
            )}
            widthTooltip="w-52 lg:w-64"
            iconClassName="h-3.5 w-3.5 text-darkCustom lg:h-5 lg:w-5"
          >
            {dataImpactStories.map(story => (
              <ImpactStoryCard
                key={story.id}
                by={story.by}
                date={story.date}
                description={story.description}
                image={story.image}
                title={story.title}
              />
            ))}
          </PageCard>
        </When>

        <PageCard
          className="border-0 px-4 py-6"
          classNameSubTitle="mt-4"
          gap={8}
          subtitleMore={true}
          title={t("Hectares Under Restoration")}
          variantSubTitle="text-14-light"
          tooltip={t(
            "This section displays data related to Indicator 2: Hectares Under Restoration described in <a href='https://terramatchsupport.zendesk.com/hc/en-us/articles/21178354112539-The-TerraFund-Monitoring-Reporting-and-Verification-Framework' target='_blank'>TerraFund’s Monitoring, Reporting, and Verification framework</a>. Please refer to the linked framework for details on how these numbers are sourced and verified. Restoration strategies and target land use types are defined <a href='https://terramatchsupport.zendesk.com/hc/en-us/articles/21178354112539-The-TerraFund-Monitoring-Reporting-and-Verification-Framework' target='_blank'>here</a>."
          )}
          iconClassName="h-3.5 w-3.5 text-darkCustom lg:h-5 lg:w-5"
          subtitle={t(
            `The numbers and reports below display data related to Indicator 2: Hectares Under Restoration described in <span class="underline">TerraFund’s MRV framework</span>. Please refer to the linked MRV framework for details on how these numbers are sourced and verified.`
          )}
          widthTooltip="w-52 lg:w-64"
        >
          <div className="grid w-3/4 auto-cols-max grid-flow-col gap-12 divide-x divide-grey-1000">
            <SecDashboard
              title={t("Total Hectares Under Restoration")}
              data={TOTAL_HECTARES_UNDER_RESTORATION}
              classNameBody="w-full place-content-center"
              tooltip={t(
                "Total land area measured in hectares with active restoration interventions, tallied by the total area of polygons submitted by projects."
              )}
            />
            <SecDashboard
              title={t("Total Number Of Sites")}
              data={TOTAL_NUMBER_OF_SITES}
              className="pl-12"
              classNameBody="w-full place-content-center"
              tooltip={t(
                "Sites are the fundamental unit for reporting data on TerraMatch. They consist of either a single restoration area or a grouping of restoration areas, represented by one or several geospatial polygons."
              )}
            />
          </div>
          <SecDashboard
            title={t("Restoration Strategies Represented")}
            data={RESTORATION_STRATEGIES_REPRESENTED}
            tooltip={t(
              "Total hectares under restoration broken down by restoration strategy. Please note that multiple restoration strategies can occur within a single hectare. Please refer to the link in the description above for detailed definitions."
            )}
          />
          <SecDashboard
            title={t("Target Land Use Types Represented")}
            data={TARGET_LAND_USE_TYPES_REPRESENTED}
            tooltip={t(
              "Total hectares under restoration broken down by target land use types. Please refer to the link in the description above for detailed definitions."
            )}
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
          <Table columns={columns} data={data} variant={VARIANT_TABLE_DASHBOARD_COUNTRIES} />
        </PageCard>
      </PageRow>
    </div>
  );
};

export default ContentOverview;
