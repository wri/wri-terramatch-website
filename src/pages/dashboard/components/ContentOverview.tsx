import { useMediaQuery } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import React, { useEffect, useState } from "react";

import Button from "@/components/elements/Button/Button";
import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import Table from "@/components/elements/Table/Table";
import {
  VARIANT_TABLE_DASHBOARD_COUNTRIES,
  VARIANT_TABLE_DASHBOARD_COUNTRIES_MODAL
} from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalExpand from "@/components/extensive/Modal/ModalExpand";
import ModalStory from "@/components/extensive/Modal/ModalStory";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import LoadingContainerOpacity from "@/components/generic/Loading/LoadingContainerOpacity";
import { CHART_TYPES } from "@/constants/dashboardConsts";
import { useDashboardContext } from "@/context/dashboard.provider";
import { useModalContext } from "@/context/modal.provider";
import { DashboardGetProjectsData } from "@/generated/apiSchemas";
import { HectaresUnderRestorationData } from "@/utils/dashboardUtils";

import ContentDashboardtWrapper from "./ContentDashboardWrapper";
import SecDashboard from "./SecDashboard";
import TooltipGridMap from "./TooltipGridMap";

const TOTAL_NUMBER_OF_SITES_TOOLTIP =
  "Sites are the fundamental unit for reporting data on TerraMatch. They consist of either a single restoration area or a grouping of restoration areas, represented by one or several geospatial polygons.";
const TOTAL_HECTARES_UNDER_RESTORATION_TOOLTIP =
  "Total land area measured in hectares with active restoration interventions, tallied by the total area of polygons submitted by projects.";
const MAP_TOOLTIP =
  "Click on a country or project to view additional information. Zooming in on the map will display satellite imagery. Those with access to individual project pages can see approved polygons and photos.";
const TARGET_LAND_USE_TYPES_REPRESENTED_TOOLTIP =
  "Total hectares under restoration broken down by target land use types.";
const RESTORATION_STRATEGIES_REPRESENTED_TOOLTIP =
  "Total hectares under restoration broken down by restoration strategy. Please note that multiple restoration strategies can occur within a single hectare.";
const TERRAFUND_MONITORING_LINK = "https://www.wri.org/update/land-degradation-project-recipe-for-restoration";
const TERRAFUND_MRV_LINK = `<a href=${TERRAFUND_MONITORING_LINK} class="underline !text-black" target="_blank">TerraFund's MRV framework</a>`;
const IMPACT_STORIES_TOOLTIP =
  "Impact stories, drawn from narrative reports, site visits, and updates from project managers, give color to the numerical data on the TerraMatch Dashboard. If you are a TerraFund champion and would like to share an impact story, please email our support team at info@terramatch.org.";
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
  transformedStories: any;
  isLoading: boolean;
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
    isLoadingHectaresUnderRestoration = false,
    transformedStories,
    isLoading
  } = props;
  const t = useT();
  const modalMapFunctions = useMap();
  const dashboardMapFunctions = useMap();
  const { openModal, closeModal, setModalLoading } = useModalContext();
  const { filters, setFilters, dashboardCountries } = useDashboardContext();
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);
  const [selectedLandscapes, setSelectedLandscapes] = useState<string[] | undefined>(undefined);
  const [dashboardMapLoaded, setDashboardMapLoaded] = useState(false);
  const [modalMapLoaded, setModalMapLoaded] = useState(false);
  const [projectUUID, setProjectUUID] = useState<string | undefined>(undefined);
  const isMobile = useMediaQuery("(max-width: 1200px)");

  useEffect(() => {
    setSelectedCountry(filters.country.country_slug);
  }, [filters.country]);
  useEffect(() => {
    setSelectedLandscapes(filters.landscapes || []);
  }, [filters.landscapes]);
  useEffect(() => {
    setProjectUUID(filters.uuid);
  }, [filters.uuid]);
  const [currentBbox, setCurrentBbox] = useState<BBox | undefined>(initialBbox);
  useEffect(() => {
    if (initialBbox) {
      setCurrentBbox(initialBbox);
    }
  }, [initialBbox]);

  useEffect(() => {
    setModalLoading("modalExpand", modalMapLoaded);
  }, [modalMapLoaded, setModalLoading]);
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

  const columnsModalImpactStories = [
    {
      header: "Impact Story",
      accessorKey: "title",
      enableSorting: true
    },
    {
      header: "Country",
      cell: (props: any) => {
        const countries = props.row.original.organization.countries_data || [];
        if (countries.length === 0) {
          return <Text variant="text-14">-</Text>;
        }

        return (
          <div className="flex flex-wrap items-center gap-2">
            {countries.map((country: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <img src={country.icon} alt={`${country.label} flag`} className="h-3 w-5 min-w-[20px] object-cover" />
                <Text variant="text-14">{country.label}</Text>
              </div>
            ))}
          </div>
        );
      },
      accessorKey: "organization.countries_data",
      enableSorting: true
    },
    {
      header: "Organization",
      accessorKey: "organization.name",
      enableSorting: true
    },
    {
      header: "Date Created",
      accessorKey: "date",
      enableSorting: false
    },
    {
      header: "",
      accessorKey: "link",
      enableSorting: false,
      cell: ({ row }: { row: any }) => {
        const handleClick = () => {
          ModalStoryOpen(row.original);
        };

        return (
          <button onClick={handleClick}>
            <Icon name={IconNames.IC_ARROW_COLLAPSE} className="h-3 w-3 rotate-90 text-darkCustom hover:text-primary" />
          </button>
        );
      }
    }
  ];
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
              selectedLandscapes={selectedLandscapes}
              setLoader={setModalMapLoaded}
              projectUUID={projectUUID}
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
        <div className="w-full px-6 mobile:px-4 mobile:pb-5">
          <Table
            columns={columns.map(column => {
              column.header === "Hectares" ? (column.header = "Restoration Hectares") : column.header;
              return {
                ...column,
                enableSorting: isMobile ? false : Boolean(column.header?.length)
              };
            })}
            data={data}
            variant={VARIANT_TABLE_DASHBOARD_COUNTRIES_MODAL}
            hasPagination={true}
            invertSelectPagination={true}
            initialTableState={{ pagination: { pageSize: 10 } }}
            classNameWrapper="mobile:px-0"
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

  const ModalTableImpactStories = () => {
    openModal(
      "modalExpand",
      <ModalExpand
        id="modalExpand"
        title={t("IMPACT STORIES")}
        popUpContent={t(IMPACT_STORIES_TOOLTIP)}
        closeModal={closeModal}
      >
        <div className="w-full px-6 mobile:px-4">
          <Table
            columns={columnsModalImpactStories}
            data={transformedStories}
            variant={VARIANT_TABLE_DASHBOARD_COUNTRIES_MODAL}
            hasPagination={true}
            invertSelectPagination={true}
            initialTableState={{ pagination: { pageSize: 10 } }}
            classNameWrapper="mobile:px-0"
          />
        </div>
      </ModalExpand>
    );
  };

  const ModalStoryOpen = (storyData: any) => {
    openModal(ModalId.MODAL_STORY, <ModalStory data={storyData} preview={false} title={t("IMPACT STORY")} />);
  };

  const columnMobile = (columns as any[]).filter(
    column => column.accessorKey === "country" || column.accessorKey === "project" || column.accessorKey === "link"
  );

  return (
    <ContentDashboardtWrapper isLeftWrapper={false}>
      <div className="shadow-lg relative w-full rounded-lg border-4 border-white mobile:order-2">
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
            className="custom-popup-close-button mobile:!h-[381px]"
            centroids={centroids}
            showPopups={true}
            polygonsData={polygonsData as Record<string, string[]>}
            showImagesButton={showImagesButton}
            bbox={currentBbox}
            selectedCountry={selectedCountry}
            setLoader={setDashboardMapLoaded}
            selectedLandscapes={selectedLandscapes}
            projectUUID={projectUUID}
          />
        </LoadingContainerOpacity>
        <div className="z[1] absolute bottom-8 left-6 grid gap-2 rounded-lg bg-white px-4 py-2 mobile:hidden">
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
        className="border-0 px-4 py-6 mobile:order-5 mobile:px-0"
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
        collapseChildren={isMobile ? true : false}
      >
        <div className="grid w-3/4 auto-cols-max grid-flow-col gap-12 divide-x divide-grey-1000 mobile:divide-x-0">
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
          classNameBody="ml-[-40px] lg:ml-[-35px] mobile:mx-[-33px]"
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
        className="border-0 px-4 py-6 mobile:order-6 mobile:px-0"
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
              {!isMobile && (
                <Text variant="text-16-bold" className="capitalize text-blueCustom-900">
                  {t("See All")}
                </Text>
              )}
            </div>
          </Button>
        }
      >
        <Table
          visibleRows={50}
          columns={isMobile ? columnMobile : columns}
          data={data}
          classNameWrapper="mobile:px-0"
          onRowClick={row => {
            if (row?.country_slug) {
              setFilters(prevValues => ({
                ...prevValues,
                uuid: row.uuid as string,
                country:
                  dashboardCountries?.find(country => country.country_slug === row?.country_slug) || prevValues.country
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
      <PageCard
        className="border-0 px-4 py-6 mobile:order-7 mobile:px-0"
        classNameSubTitle="mt-4"
        gap={6}
        isUserAllowed={props.isUserAllowed}
        subtitleMore={true}
        title={t("IMPACT STORIES")}
        tooltip={t(IMPACT_STORIES_TOOLTIP)}
        tooltipTrigger="click"
        iconClassName="h-4.5 w-4.5 text-darkCustom lg:h-5 lg:w-5"
        headerChildren={
          <Button variant="white-border" onClick={ModalTableImpactStories}>
            <div className="flex items-center gap-1">
              <Icon name={IconNames.EXPAND} className="h-[14px] w-[14px]" />
              {!isMobile && (
                <Text variant="text-16-bold" className="capitalize text-blueCustom-900">
                  {t("See All")}
                </Text>
              )}
            </div>
          </Button>
        }
      >
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <span className="text-gray-500">{t("Loading...")}</span>
          </div>
        ) : transformedStories.length > 0 ? (
          <List
            items={transformedStories}
            render={item => (
              <button
                onClick={() => ModalStoryOpen(item)}
                className="group flex w-full items-center gap-4 rounded-lg border border-neutral-200 p-4 hover:shadow-monitored mobile:items-start mobile:border-transparent mobile:bg-grey-925 mobile:p-2"
              >
                <img
                  src={item.thumbnail || "/images/no-image-available.png"}
                  alt={item.title}
                  className="h-20 w-20 rounded-md object-cover"
                />
                <div className="flex flex-col items-start gap-2">
                  <Text variant="text-14-bold" className="text-left group-hover:text-primary mobile:leading-[normal]">
                    {item.title}
                  </Text>
                  <Text variant="text-12-light" className="flex items-center gap-1.5 capitalize text-grey-700">
                    <Icon name={IconNames.BRIEFCASE} className="h-4 w-4" /> {item.organization.name} Organization
                  </Text>
                  <Text variant="text-12-light" className="flex items-center gap-1.5 capitalize text-grey-700">
                    <Icon name={IconNames.PIN} className="h-4 w-4" /> {item.organization.country}
                  </Text>
                </div>
              </button>
            )}
            className="flex flex-col gap-4"
          />
        ) : (
          <div className="flex h-48 items-center justify-center">
            <span className="text-gray-500">{t("No impact stories found")}</span>
          </div>
        )}
      </PageCard>
    </ContentDashboardtWrapper>
  );
};

export default ContentOverview;
