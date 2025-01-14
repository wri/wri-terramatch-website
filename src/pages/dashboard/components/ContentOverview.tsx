import { ColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import React, { useEffect, useState } from "react";

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
import LoadingContainerOpacity from "@/components/generic/Loading/LoadingContainerOpacity";
import { CHART_TYPES, TERRAFUND_MRV_LINK } from "@/constants/dashboardConsts";
import { useDashboardContext } from "@/context/dashboard.provider";
import { useModalContext } from "@/context/modal.provider";
import { DashboardGetProjectsData } from "@/generated/apiSchemas";
import { HectaresUnderRestorationData } from "@/utils/dashboardUtils";

import {
  MAP_TOOLTIP,
  RESTORATION_STRATEGIES_REPRESENTED_TOOLTIP,
  TARGET_LAND_USE_TYPES_REPRESENTED_TOOLTIP,
  TOTAL_HECTARES_UNDER_RESTORATION_TOOLTIP,
  TOTAL_NUMBER_OF_SITES_TOOLTIP
} from "../constants/tooltips";
import { BBox } from "./../../../components/elements/Map-mapbox/GeoJSON";
import SecDashboard from "./SecDashboard";
import TooltipGridMap from "./TooltipGridMap";

interface RowData {
  country_slug: undefined;
  uuid: string;
}

interface ContentOverviewProps<TData> {
  dataTable: TData[];
  columns: ColumnDef<TData>[];
  titleTable: string;
  textTooltipTable?: string;
  centroids?: DashboardGetProjectsData[];
  polygonsData?: Record<string, string[]>;
  dataHectaresUnderRestoration: HectaresUnderRestorationData;
  showImagesButton?: boolean;
  bbox?: BBox | undefined;
  isUserAllowed?: boolean;
  isLoadingHectaresUnderRestoration?: boolean;
  projectCounts?: {
    total_enterprise_count: number;
    total_non_profit_count: number;
  };
}

const ContentOverview = (props: ContentOverviewProps<RowData>) => {
  const {
    dataTable: data,
    columns,
    titleTable,
    textTooltipTable,
    centroids,
    polygonsData,
    dataHectaresUnderRestoration,
    showImagesButton,
    bbox: initialBbox,
    projectCounts,
    isUserAllowed = true,
    isLoadingHectaresUnderRestoration = false
  } = props;
  const t = useT();
  const modalMapFunctions = useMap();
  const dashboardMapFunctions = useMap();
  const { openModal, closeModal, setModalLoading } = useModalContext();
  const { filters, setFilters, dashboardCountries } = useDashboardContext();
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);
  const [dashboardMapLoaded, setDashboardMapLoaded] = useState(false);
  const [modalMapLoaded, setModalMapLoaded] = useState(false);

  useEffect(() => {
    setSelectedCountry(filters.country.country_slug);
  }, [filters.country]);
  const [currentBbox, setCurrentBbox] = useState<BBox | undefined>(initialBbox);
  useEffect(() => {
    if (initialBbox) {
      setCurrentBbox(initialBbox);
    }
  }, [initialBbox]);

  useEffect(() => {
    setModalLoading("modalExpand", modalMapLoaded);
  }, [modalMapLoaded]);
  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));
  const handleCloseModal = () => {
    const { map } = modalMapFunctions;
    const bounds = (map.current as mapboxgl.Map).getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const clampedSwLng = clamp(sw.lng, -180, 180);
    const clampedSwLat = clamp(sw.lat, -90, 90);
    const clampedNeLng = clamp(ne.lng, -180, 180);
    const clampedNeLat = clamp(ne.lat, -90, 90);

    const modalBbox: BBox = [clampedSwLng, clampedSwLat, clampedNeLng, clampedNeLat];
    setCurrentBbox(modalBbox);
  };

  const ModalMap = () => {
    const { map } = dashboardMapFunctions;
    const bounds = (map.current as mapboxgl.Map).getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const clampedSwLng = clamp(sw.lng, -180, 180);
    const clampedSwLat = clamp(sw.lat, -90, 90);
    const clampedNeLng = clamp(ne.lng, -180, 180);
    const clampedNeLat = clamp(ne.lat, -90, 90);

    const dashboardBbox: BBox = [clampedSwLng, clampedSwLat, clampedNeLng, clampedNeLat];
    const handleModalClose = (modalId: any) => {
      handleCloseModal();
      closeModal(modalId);
    };
    openModal(
      "modalExpand",
      <ModalExpand id="modalExpand" title={t("MAP")} closeModal={handleModalClose} popUpContent={MAP_TOOLTIP}>
        <div className="shadow-lg relative w-full flex-1 overflow-hidden rounded-lg border-4 border-white">
          <LoadingContainerOpacity loading={modalMapLoaded}>
            <MapContainer
              id="modal"
              showLegend={false}
              mapFunctions={modalMapFunctions}
              isDashboard={"modal"}
              className="custom-popup-close-button !h-full"
              centroids={centroids}
              showPopups={true}
              polygonsData={polygonsData as Record<string, string[]>}
              showImagesButton={showImagesButton}
              bbox={dashboardBbox}
              selectedCountry={selectedCountry}
              setLoader={setModalMapLoaded}
            />
          </LoadingContainerOpacity>
          <TooltipGridMap label="Angola" learnMore={true} />

          <div className="absolute bottom-6 left-6 grid gap-2 rounded-lg bg-white px-4 py-2">
            <div className="flex gap-2">
              <Icon name={IconNames.IC_LEGEND_MAP} className="h-4.5 w-4.5 text-tertiary-800" />
              <Text variant="text-12" className="text-darkCustom">
                {t("Non-Profit Projects ({count})", { count: projectCounts?.total_non_profit_count ?? 0 })}
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Icon name={IconNames.IC_LEGEND_MAP} className="h-4.5 w-4.5 text-blue-50" />
              <Text variant="text-12" className="text-darkCustom">
                {t("Enterprise Projects ({count})", { count: projectCounts?.total_enterprise_count ?? 0 })}
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
            onRowClick={row => {
              closeModal("modalExpand");
              if (row?.country_slug) {
                setFilters(prevValues => ({
                  ...prevValues,
                  uuid: row.uuid as string,
                  country:
                    dashboardCountries?.find(country => country.country_slug === row?.country_slug) ||
                    prevValues.country
                }));
              }

              if (row.uuid) {
                setFilters(prevValues => ({
                  ...prevValues,
                  uuid: row.uuid
                }));
              }
              return;
            }}
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
          <LoadingContainerOpacity loading={dashboardMapLoaded}>
            <MapContainer
              id="dashboard"
              showLegend={false}
              mapFunctions={dashboardMapFunctions}
              isDashboard={"dashboard"}
              className="custom-popup-close-button"
              centroids={centroids}
              showPopups={true}
              polygonsData={polygonsData as Record<string, string[]>}
              showImagesButton={showImagesButton}
              bbox={currentBbox}
              selectedCountry={selectedCountry}
              setLoader={setDashboardMapLoaded}
            />
          </LoadingContainerOpacity>
          <div className="z[1] absolute bottom-8 left-6 grid gap-2 rounded-lg bg-white px-4 py-2">
            <div className="flex gap-2">
              <Icon name={IconNames.IC_LEGEND_MAP} className="h-4.5 w-4.5 text-tertiary-800" />
              <Text variant="text-12" className="text-darkCustom">
                {t("Non-Profit Projects ({count})", { count: projectCounts?.total_non_profit_count ?? 0 })}
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Icon name={IconNames.IC_LEGEND_MAP} className="h-4.5 w-4.5 text-blue-50" />
              <Text variant="text-12" className="text-darkCustom">
                {t("Enterprise Projects ({count})", { count: projectCounts?.total_enterprise_count ?? 0 })}
              </Text>
            </div>
          </div>
        </div>

        <PageCard
          className="border-0 px-4 py-6"
          classNameSubTitle="mt-4"
          gap={8}
          isUserAllowed={isUserAllowed}
          subtitleMore={true}
          title={t("HECTARES UNDER RESTORATION")}
          variantSubTitle="text-14-light"
          iconClassName="h-3.5 w-3.5 text-darkCustom lg:h-5 lg:w-5"
          subtitle={t(
            `The numbers and reports below display data related to Indicator 2: Hectares Under Restoration described in ${TERRAFUND_MRV_LINK}. Please refer to the linked MRV framework for details on how these numbers are sourced and verified.`
          )}
          widthTooltip="w-52 lg:w-64"
        >
          <div className="grid w-3/4 auto-cols-max grid-flow-col gap-12 divide-x divide-grey-1000">
            <SecDashboard
              title={t("Total Hectares Under Restoration")}
              data={{ value: dataHectaresUnderRestoration?.totalSection.totalHectaresRestored }}
              classNameBody="w-full place-content-center"
              tooltip={t(TOTAL_HECTARES_UNDER_RESTORATION_TOOLTIP)}
              isUserAllowed={isUserAllowed}
            />
            <SecDashboard
              title={t("Total Number Of Sites")}
              data={{ value: dataHectaresUnderRestoration?.totalSection.numberOfSites }}
              className="pl-12"
              classNameBody="w-full place-content-center"
              tooltip={t(TOTAL_NUMBER_OF_SITES_TOOLTIP)}
              isUserAllowed={isUserAllowed}
            />
          </div>
          <SecDashboard
            title={t("Restoration Strategies Represented")}
            data={{}}
            classNameBody="ml-[-40px] lg:ml-[-35px]"
            chartType={CHART_TYPES.simpleBarChart}
            dataForChart={dataHectaresUnderRestoration}
            tooltip={t(RESTORATION_STRATEGIES_REPRESENTED_TOOLTIP)}
            isUserAllowed={isUserAllowed}
            isLoading={isLoadingHectaresUnderRestoration}
          />
          <SecDashboard
            title={t("Target Land Use Types Represented")}
            chartType={CHART_TYPES.barChart}
            data={dataHectaresUnderRestoration}
            tooltip={t(TARGET_LAND_USE_TYPES_REPRESENTED_TOOLTIP)}
            isUserAllowed={isUserAllowed}
            isLoading={isLoadingHectaresUnderRestoration}
          />
        </PageCard>

        <PageCard
          className="border-0 px-4 py-6"
          classNameSubTitle="mt-4"
          gap={6}
          isUserAllowed={isUserAllowed}
          subtitleMore={true}
          title={t(titleTable)}
          tooltip={textTooltipTable}
          tooltipTrigger="click"
          iconClassName="h-4.5 w-4.5 text-darkCustom lg:h-5 lg:w-5"
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
          <Table
            visibleRows={50}
            columns={columns}
            data={data}
            onRowClick={row => {
              if (row?.country_slug) {
                setFilters(prevValues => ({
                  ...prevValues,
                  uuid: row.uuid as string,
                  country:
                    dashboardCountries?.find(country => country.country_slug === row?.country_slug) ||
                    prevValues.country
                }));
              }

              if (row.uuid) {
                setFilters(prevValues => ({
                  ...prevValues,
                  uuid: row.uuid
                }));
              }
              return;
            }}
            classNameTableWrapper={
              filters.country.id === 0 ? "" : "!max-h-[391px] lg:!max-h-[423px] wide:!max-h-[457  px]"
            }
            variant={VARIANT_TABLE_DASHBOARD_COUNTRIES}
          />
        </PageCard>
      </PageRow>
    </div>
  );
};

export default ContentOverview;
