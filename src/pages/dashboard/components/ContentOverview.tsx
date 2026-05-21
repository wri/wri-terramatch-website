import { useMediaQuery } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { Map as MapboxMap } from "mapbox-gl";
import React, { useCallback, useMemo, useState } from "react";

import { DashboardExpandedMapModalContent } from "@/components/dashboard/DashboardExpandedMapModalContent";
import { DashboardMapLegend } from "@/components/dashboard/DashboardMapLegend";
import { buildImpactStoriesModalColumns, ImpactStoryModalRow } from "@/components/dashboard/impactStoriesModalColumns";
import Button from "@/components/elements/Button/Button";
import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { useBaseMap } from "@/components/elements/Map-mapbox/hooks/useBaseMap";
import { computePolygonFingerprint } from "@/components/elements/Map-mapbox/hooks/useMapLayers";
import { DashboardGetProjectsData, MapContainer } from "@/components/elements/Map-mapbox/Map";
import { MapStyle } from "@/components/elements/Map-mapbox/MapControls/types";
import { buildDashboardMapProps } from "@/components/elements/Map-mapbox/mapProps.builders";
import { getCurrentMapStyle, getMapTileVersion } from "@/components/elements/Map-mapbox/utils";
import Table from "@/components/elements/Table/Table";
import {
  VARIANT_TABLE_DASHBOARD_COUNTRIES,
  VARIANT_TABLE_DASHBOARD_COUNTRIES_MODAL
} from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import ModalExpand from "@/components/extensive/Modal/ModalExpand";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import LoadingContainerOpacity from "@/components/generic/Loading/LoadingContainerOpacity";
import { useGadmChoices } from "@/connections/Gadm";
import { CHART_TYPES } from "@/constants/dashboardConsts";
import { useDashboardContext } from "@/context/dashboard.provider";
import { useModalContext } from "@/context/modal.provider";
import { useDashboardImpactStoryModal } from "@/hooks/useDashboardImpactStoryModal";
import { useValueChanged } from "@/hooks/useValueChanged";
import { TranslatedText } from "@/i18n/types";
import {
  DASHBOARD_MOBILE_MEDIA_QUERY,
  IMPACT_STORIES_TOOLTIP,
  MODAL_EXPAND_ID,
  MODAL_TABLE_PAGE_SIZE,
  RESTORATION_STRATEGIES_REPRESENTED_TOOLTIP,
  TARGET_LAND_USE_TYPES_REPRESENTED_TOOLTIP,
  TERRAFUND_MRV_LINK,
  TOTAL_HECTARES_UNDER_RESTORATION_TOOLTIP,
  TOTAL_NUMBER_OF_SITES_TOOLTIP,
  VISIBLE_TABLE_ROWS_ON_DASHBOARD
} from "@/pages/dashboard/constants/contentOverviewConstants";
import { useDashboardMapViewportSync } from "@/pages/dashboard/hooks/useDashboardMapViewportSync";
import { clampLongitudeLatitude } from "@/pages/dashboard/utils/mapViewport";
import { HectaresUnderRestorationData } from "@/utils/dashboardUtils";

import { useContentOverviewTexts } from "../hooks/useContentOverviewTexts";
import ContentDashboardtWrapper from "./ContentDashboardWrapper";
import SecDashboard from "./SecDashboard";

export { IMPACT_STORIES_TOOLTIP };

interface RowData {
  country: string | null;
  uuid: string;
}

interface ContentOverviewProps<TData> {
  dataTable: TData[];
  columns: ColumnDef<TData>[];
  titleTable: TranslatedText;
  textTooltipTable?: TranslatedText;
  centroids?: DashboardGetProjectsData[];
  polygonsData?: { data: Record<string, string[]>; centroids: unknown[] };
  dataHectaresUnderRestoration: HectaresUnderRestorationData;
  bbox?: BBox | undefined;
  isUserAllowed?: boolean;
  isLoadingHectaresUnderRestoration?: boolean;
  projectCounts?: {
    totalEnterpriseCount: number;
    totalNonProfitCount: number;
  };
  transformedStories: ImpactStoryModalRow[];
  isLoading: boolean;
  hasAccess?: boolean;
  projectFrameworkKey?: string | null;
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
    bbox: initialBbox,
    projectCounts,
    isUserAllowed = true,
    isLoadingHectaresUnderRestoration = false,
    transformedStories,
    isLoading,
    hasAccess,
    projectFrameworkKey
  } = props;

  const t = useT();
  const modalMapFunctions = useBaseMap();
  const dashboardMapFunctions = useBaseMap();
  const { openModal, closeModal, setModalLoading } = useModalContext();
  const { filters, setFilters, dashboardCountries } = useDashboardContext();

  const [dashboardMapLoaded, setDashboardMapLoaded] = useState(false);
  const [modalMapLoaded, setModalMapLoaded] = useState(false);
  const [selectedProjectUuid, setSelectedProjectUuid] = useState<string | undefined>(undefined);

  const countryChoices = useGadmChoices({ level: 0 });
  const isMobile = useMediaQuery(DASHBOARD_MOBILE_MEDIA_QUERY);

  const landscapeNamesForBorderOverlay = useMemo(() => filters.landscapes ?? [], [filters.landscapes]);

  const { openStoryFromListItem } = useDashboardImpactStoryModal();

  const contentOverviewTexts = useContentOverviewTexts();

  useValueChanged(filters.uuid, () => {
    setSelectedProjectUuid(filters.uuid);
  });

  const [currentBbox, setCurrentBbox] = useState<BBox | undefined>(initialBbox);
  const [currentCenter, setCurrentCenter] = useState<[number, number] | undefined>(undefined);
  const [currentZoom, setCurrentZoom] = useState<number | undefined>(undefined);
  const [currentMapStyle, setCurrentMapStyle] = useState<MapStyle | undefined>(MapStyle.Street);

  useValueChanged(initialBbox, () => {
    if (initialBbox) {
      setCurrentBbox(initialBbox);
    }
  });

  useValueChanged(modalMapLoaded, () => {
    setModalLoading(MODAL_EXPAND_ID, modalMapLoaded);
  });

  const { handleCloseExpandedMapModal } = useDashboardMapViewportSync({
    dashboardMapFunctions,
    dashboardMapLoaded,
    modalMapFunctions,
    modalMapLoaded,
    setCurrentCenter,
    setCurrentZoom,
    setCurrentMapStyle
  });

  const handleMapStyleChange = (style: MapStyle) => {
    setCurrentMapStyle(style);
  };

  const handleOpenExpandedMap = useCallback(() => {
    const dashboardMap = dashboardMapFunctions.map.current as MapboxMap | null;

    let initialCenter: [number, number] | undefined;
    let initialZoom: number | undefined;
    let mapStyleForModal: MapStyle | undefined;

    if (dashboardMap) {
      const center = dashboardMap.getCenter();
      const zoom = dashboardMap.getZoom();
      const styleFromMap = getCurrentMapStyle(dashboardMap);
      const [clampedLng, clampedLat] = clampLongitudeLatitude(center.lng, center.lat);
      initialCenter = [clampedLng, clampedLat];
      initialZoom = zoom;
      mapStyleForModal = styleFromMap ?? currentMapStyle;

      if (styleFromMap != null && styleFromMap !== currentMapStyle) {
        setCurrentMapStyle(styleFromMap);
      }
    }

    const embeddedTileVersion = getMapTileVersion(dashboardMap);
    const embeddedPolygonFingerprint = computePolygonFingerprint(
      polygonsData?.data as Record<string, string[]> | undefined
    );

    const handleExpandedMapModalClose = (modalId: string) => {
      handleCloseExpandedMapModal();
      closeModal(modalId);
    };

    openModal(
      MODAL_EXPAND_ID,
      <ModalExpand
        id={MODAL_EXPAND_ID}
        title={t("MAP")}
        closeModal={handleExpandedMapModalClose}
        popUpContent={contentOverviewTexts.MAP_TOOLTIP}
      >
        <DashboardExpandedMapModalContent
          modalMapFunctions={modalMapFunctions}
          modalMapLoaded={modalMapLoaded}
          centroids={centroids}
          polygonsData={polygonsData}
          initialCenter={initialCenter ?? currentCenter}
          initialZoom={initialZoom !== undefined ? initialZoom : currentZoom}
          mapStyle={mapStyleForModal ?? currentMapStyle}
          onModalMapStyleChange={handleMapStyleChange}
          landscapeNamesForBorderOverlay={landscapeNamesForBorderOverlay}
          onModalMapLoadComplete={setModalMapLoaded}
          selectedProjectUuid={selectedProjectUuid}
          hasAccess={hasAccess}
          setFilters={setFilters}
          dashboardCountries={dashboardCountries}
          translate={t}
          nonProfitProjectCount={projectCounts?.totalNonProfitCount ?? 0}
          enterpriseProjectCount={projectCounts?.totalEnterpriseCount ?? 0}
          initialTileVersion={embeddedTileVersion}
          initialPolygonFingerprint={embeddedPolygonFingerprint}
        />
      </ModalExpand>
    );
  }, [
    centroids,
    polygonsData,
    currentCenter,
    currentZoom,
    currentMapStyle,
    dashboardMapFunctions,
    dashboardCountries,
    handleCloseExpandedMapModal,
    closeModal,
    hasAccess,
    landscapeNamesForBorderOverlay,
    modalMapFunctions,
    modalMapLoaded,
    openModal,
    projectCounts?.totalEnterpriseCount,
    projectCounts?.totalNonProfitCount,
    selectedProjectUuid,
    setFilters,
    t,
    contentOverviewTexts.MAP_TOOLTIP
  ]);

  const openActiveTableModal = useCallback(() => {
    openModal(
      MODAL_EXPAND_ID,
      <ModalExpand id={MODAL_EXPAND_ID} title={titleTable} popUpContent={textTooltipTable} closeModal={closeModal}>
        <div className="w-full px-6 mobile:px-4 mobile:pb-5">
          <Table
            columns={
              columns.map(column => ({
                ...column,
                header: column.header === "Hectares" ? "Restoration Hectares" : column.header,
                enableSorting: isMobile ? false : Boolean(column.header?.length)
              })) as ColumnDef<RowData>[]
            }
            data={data}
            variant={VARIANT_TABLE_DASHBOARD_COUNTRIES_MODAL}
            hasPagination={true}
            invertSelectPagination={true}
            initialTableState={{ pagination: { pageSize: MODAL_TABLE_PAGE_SIZE } }}
            classNameWrapper="mobile:px-0"
            onRowClick={row => {
              closeModal(MODAL_EXPAND_ID);
              if (row?.country) {
                setFilters(prevValues => ({
                  ...prevValues,
                  uuid: (row.uuid ?? "") as string,
                  country: dashboardCountries?.find(c => c.country_slug === row?.country) ?? prevValues.country
                }));
              }

              if (row.uuid) {
                setFilters(prevValues => ({
                  ...prevValues,
                  uuid: (row.uuid ?? "") as string
                }));
              }
            }}
          />
        </div>
      </ModalExpand>
    );
  }, [columns, closeModal, dashboardCountries, data, isMobile, openModal, setFilters, textTooltipTable, titleTable]);

  const impactStoriesModalColumns = useMemo(
    () => buildImpactStoriesModalColumns(openStoryFromListItem),
    [openStoryFromListItem]
  );

  const openImpactStoriesTableModal = useCallback(() => {
    openModal(
      MODAL_EXPAND_ID,
      <ModalExpand
        id={MODAL_EXPAND_ID}
        title={t("IMPACT STORIES")}
        popUpContent={t(IMPACT_STORIES_TOOLTIP)}
        closeModal={closeModal}
      >
        <div className="w-full px-6 mobile:px-4">
          <Table
            columns={impactStoriesModalColumns}
            data={transformedStories}
            variant={VARIANT_TABLE_DASHBOARD_COUNTRIES_MODAL}
            hasPagination={true}
            invertSelectPagination={true}
            initialTableState={{ pagination: { pageSize: MODAL_TABLE_PAGE_SIZE } }}
            classNameWrapper="mobile:px-0"
          />
        </div>
      </ModalExpand>
    );
  }, [closeModal, impactStoriesModalColumns, openModal, t, transformedStories]);

  const mobileTableColumns = useMemo(
    () =>
      (columns as ColumnDef<RowData>[]).filter(column => {
        const accessorKey = "accessorKey" in column ? column.accessorKey : undefined;
        return accessorKey === "country" || accessorKey === "project" || accessorKey === "link";
      }),
    [columns]
  );

  const nonProfitProjectCount = projectCounts?.totalNonProfitCount ?? 0;
  const enterpriseProjectCount = projectCounts?.totalEnterpriseCount ?? 0;

  return (
    <ContentDashboardtWrapper isLeftWrapper={false}>
      <div className="shadow-lg relative w-full rounded-lg border-4 border-white mobile:order-2">
        <Button
          className="absolute right-5 top-6 z-10 mobile:hidden"
          variant="white-button-map"
          onClick={handleOpenExpandedMap}
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
            {...buildDashboardMapProps({
              mode: "dashboard",
              mapFunctions: dashboardMapFunctions,
              centroids,
              polygonsData: polygonsData?.data as Record<string, string[]> | undefined,
              polygonsCentroids: polygonsData?.centroids as { uuid: string; long: number; lat: number }[] | undefined,
              bbox: currentBbox,
              center: currentCenter,
              zoom: currentZoom,
              mapStyle: currentMapStyle,
              onStyleChange: handleMapStyleChange,
              setLoader: setDashboardMapLoaded,
              selectedLandscapes: landscapeNamesForBorderOverlay,
              projectUUID: selectedProjectUuid,
              hasAccess,
              className: "custom-popup-close-button !h-[600px] mobile:!h-[381px]"
            })}
          />
        </LoadingContainerOpacity>
        {!selectedProjectUuid && (
          <DashboardMapLegend
            nonProfitProjectCount={nonProfitProjectCount}
            enterpriseProjectCount={enterpriseProjectCount}
            translate={t}
          />
        )}
      </div>
      <PageCard
        className="border-0 px-4 py-6 uppercase mobile:order-6 mobile:px-0"
        classNameSubTitle="mt-4"
        gap={6}
        isUserAllowed={isUserAllowed}
        projectFrameworkKey={projectFrameworkKey}
        subtitleMore={true}
        title={t(titleTable)}
        tooltip={textTooltipTable}
        tooltipTrigger="click"
        iconClassName="h-4.5 w-4.5 text-darkCustom lg:h-5 lg:w-5"
        headerChildren={
          <Button variant="white-border" onClick={openActiveTableModal}>
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
          visibleRows={VISIBLE_TABLE_ROWS_ON_DASHBOARD}
          columns={isMobile ? mobileTableColumns : columns}
          data={data}
          classNameWrapper="mobile:px-0"
          onRowClick={row => {
            if (row?.country && filters.country.id === 0) {
              setFilters(prevValues => ({
                ...prevValues,
                uuid: "",
                country: {
                  country_slug: row.uuid as string,
                  id: 1,
                  data: {
                    label: row.country?.split("_")[0] ?? "",
                    icon: `/flags/${(row.uuid as string).toLowerCase()}.svg`
                  }
                }
              }));
              return;
            }

            if (row.uuid) {
              setFilters(prevValues => ({
                ...prevValues,
                uuid: row.uuid
              }));
            }
          }}
          classNameTableWrapper={
            filters.country.id === 0 ? "" : "!max-h-[391px] lg:!max-h-[423px] wide:!max-h-[457  px]"
          }
          variant={VARIANT_TABLE_DASHBOARD_COUNTRIES}
        />
      </PageCard>

      <PageCard
        className="border-0 px-4 py-6 mobile:order-5 mobile:px-0"
        classNameSubTitle="mt-4"
        gap={8}
        isUserAllowed={isUserAllowed}
        projectFrameworkKey={projectFrameworkKey}
        subtitleMore={true}
        title={t("HECTARES UNDER RESTORATION")}
        variantSubTitle="text-14-light"
        iconClassName="h-3.5 w-3.5 text-darkCustom lg:h-5 lg:w-5"
        subtitle={t(
          `The numbers and reports below display data related to Indicator 2: Hectares Under Restoration described in ${TERRAFUND_MRV_LINK}. Please refer to the linked MRV framework for details on how these numbers are sourced and verified.`
        )}
        widthTooltip="w-52 lg:w-64"
        collapseChildren={isMobile}
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
          classNameBody="ml-[-30px] lg:ml-[-24px] mobile:mx-[-33px] wide:ml-[-16px]"
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
        className="border-0 px-4 py-6 mobile:order-7 mobile:px-0"
        classNameSubTitle="mt-4"
        gap={6}
        isUserAllowed={props.isUserAllowed}
        projectFrameworkKey={projectFrameworkKey}
        subtitleMore={true}
        title={t("IMPACT STORIES")}
        tooltip={t(IMPACT_STORIES_TOOLTIP)}
        widthTooltip="w-64 lg:w-72"
        tooltipTrigger="click"
        iconClassName="h-4.5 w-4.5 text-darkCustom lg:h-5 lg:w-5"
        headerChildren={
          <Button variant="white-border" onClick={openImpactStoriesTableModal}>
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
          <div className="-mr-2 max-h-[513px] overflow-scroll pr-2 lg:max-h-[520px] wide:max-h-[560px]">
            <List
              items={transformedStories}
              render={item => (
                <button
                  type="button"
                  onClick={() => openStoryFromListItem(item)}
                  className="group flex w-full items-center gap-4 rounded-lg border border-neutral-200 p-4 hover:shadow-monitored mobile:items-start mobile:border-transparent mobile:bg-grey-925 mobile:p-2"
                >
                  <img
                    src={item.thumbnail ?? "/images/no-image-available.png"}
                    alt={item.title}
                    className="h-20 w-20 rounded-md object-cover"
                  />
                  <div className="flex flex-col items-start gap-2">
                    <Text variant="text-14-bold" className="text-left group-hover:text-primary mobile:leading-[normal]">
                      {item.title}
                    </Text>
                    <Text variant="text-12-light" className="flex items-center gap-1.5 capitalize text-grey-700">
                      <Icon name={IconNames.BRIEFCASE} className="h-4 w-4" /> {item.organization.name}
                    </Text>
                    <Text variant="text-12-light" className="flex items-center gap-1.5 capitalize text-grey-700">
                      <Icon name={IconNames.PIN} className="h-4 w-4" />{" "}
                      {(() => {
                        const gadmCountry = countryChoices.find(choice => choice.id === item.organization.country);
                        return gadmCountry ? gadmCountry.name : item.organization.country;
                      })()}
                    </Text>
                  </div>
                </button>
              )}
              className="flex flex-col gap-4"
            />
          </div>
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
