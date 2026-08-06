import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";

import { useBaseMap } from "@/components/elements/Map-mapbox/hooks/useBaseMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import { resolveMapExtentBbox, useBoundingBox } from "@/connections/BoundingBox";
import { useDelayedJobs } from "@/connections/DelayedJob";
import { SupportedEntity, useMedias } from "@/connections/EntityAssociation";
import {
  POLYGON_APPROVED,
  POLYGON_DRAFT,
  POLYGON_INFORMATION_REQUIRED,
  POLYGON_PENDING_APPROVAL
} from "@/constants/polygonStatuses";
import { AnrMapOverlayProvider } from "@/context/anrMapOverlay.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import useLoadSitePolygonsData from "@/hooks/paginated/useLoadSitePolygonData";
import { useValueChanged } from "@/hooks/useValueChanged";

import MapPolygonPanel from "../../MapPolygonPanel/MapPolygonPanel";
import { parsePolygonDataV3, storePolygon } from "../utils";
import LoadingMap from "./LoadingMap";

interface EntityAreaProps {
  entityModel: any;
  type: string;
  refetch?: () => void;
  polygonVersionData?: SitePolygonLightDto[];
  refetchPolygonVersions?: () => void;
  className?: string;
  disabledPolygonPanel?: boolean;
  hideFullscreenControl?: boolean;
  overviewPolygonPopup?: boolean;
}

const OverviewMapArea = ({
  entityModel,
  type,
  refetch: refreshEntity,
  polygonVersionData,
  refetchPolygonVersions,
  className,
  disabledPolygonPanel,
  hideFullscreenControl = false,
  overviewPolygonPopup = false
}: EntityAreaProps) => {
  const t = useT();
  const [polygonDataMap, setPolygonDataMap] = useState<any>({});
  const [isPolygonTilesLoading, setIsPolygonTilesLoading] = useState(false);
  const [tabEditPolygon, setTabEditPolygon] = useState("Attributes");
  const [stateViewPanel, setStateViewPanel] = useState(false);
  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");
  const [polygonFromMap, setPolygonFromMap] = useState<any>({ isOpen: false, uuid: "" });
  const [processedPolyValidationJobs, setProcessedPolyValidationJobs] = useState<Set<string>>(new Set());
  const context = useSitePolygonData();
  const reloadSiteData = context?.reloadSiteData;

  const {
    editPolygon,
    shouldRefetchPolygonData,
    setEditPolygon,
    setSelectedPolygonsInCheckbox,
    setPolygonCriteriaMap,
    setPolygonData,
    shouldRefetchValidation,
    setShouldRefetchValidation,
    setShouldRefetchPolygonData,
    polygonData: sitePolygonDataV3,
    validFilter
  } = useMapAreaContext();

  const [, { delayedJobs }] = useDelayedJobs();
  const onSave = (geojson: any) =>
    storePolygon(
      geojson,
      { uuid: entityModel.uuid, entityName: type === "sites" ? "site" : type },
      setEditPolygon,
      refetch
    );

  const mapFunctions = useBaseMap(onSave);

  const [, { data: mediaFiles }] = useMedias({
    entity: type as SupportedEntity,
    uuid: entityModel?.uuid,
    enabled: entityModel?.uuid != null
  });

  const {
    data: polygonsData,
    refetch,
    polygonCriteriaMap,
    loading
  } = useLoadSitePolygonsData(entityModel.uuid, type, checkedValues.join(","), sortField, sortDirection, validFilter);

  const hasPolygons = polygonsData.length > 0;
  const entityType = type === "sites" ? "sites" : "projects";

  const modelBbox = useBoundingBox(
    entityType === "sites" ? { siteUuid: entityModel.uuid } : { projectUuid: entityModel.uuid }
  );

  const projectBbox = useBoundingBox(
    entityType === "sites" && !hasPolygons && entityModel?.projectUuid != null && entityModel.projectUuid !== ""
      ? { projectUuid: entityModel.projectUuid }
      : {}
  );

  const countryBbox = useBoundingBox(
    hasPolygons
      ? {}
      : entityType === "sites"
      ? { country: entityModel?.projectCountry }
      : { country: entityModel?.country }
  );

  const extentBbox = useMemo(
    () =>
      resolveMapExtentBbox({
        entityType,
        hasPolygons,
        modelBbox,
        projectBbox,
        projectUuid: entityModel?.projectUuid,
        countryBbox
      }),
    [countryBbox, entityModel?.projectUuid, entityType, hasPolygons, modelBbox, projectBbox]
  );

  useValueChanged(loading, () => {
    setPolygonCriteriaMap(polygonCriteriaMap);
    setPolygonData(polygonsData);
  });
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedValues, sortField, sortDirection, validFilter]);

  useEffect(() => {
    if (disabledPolygonPanel) {
      setPolygonFromMap({ isOpen: false, uuid: "" });
      return;
    }
    const { isOpen, uuid } = editPolygon;
    setPolygonFromMap({ isOpen, uuid });
    if (isOpen) {
      setSelectedPolygonsInCheckbox([]);
    }
  }, [editPolygon, disabledPolygonPanel, setSelectedPolygonsInCheckbox]);

  useValueChanged(shouldRefetchPolygonData, async () => {
    if (shouldRefetchPolygonData) {
      await Promise.all([refetch(), reloadSiteData?.()]);
      setShouldRefetchPolygonData(false);
    }
  });
  useValueChanged(shouldRefetchValidation, () => {
    if (shouldRefetchValidation) {
      refetch();
      setShouldRefetchValidation(false);
    }
  });

  useEffect(() => {
    if (delayedJobs == null || delayedJobs.length === 0) return;

    const newlyCompleted = delayedJobs.filter(
      job => job.name === "Polygon Validation" && job.status !== "pending" && !processedPolyValidationJobs.has(job.uuid)
    );

    if (newlyCompleted.length > 0) {
      setProcessedPolyValidationJobs(prev => {
        const next = new Set(prev);
        newlyCompleted.forEach(j => next.add(j.uuid));
        return next;
      });
      refetch();
    }
  }, [delayedJobs, processedPolyValidationJobs, refetch]);
  useEffect(() => {
    if (polygonsData?.length > 0) {
      const dataMap = parsePolygonDataV3(polygonsData);
      setPolygonDataMap(dataMap);
    } else {
      setPolygonDataMap({
        [POLYGON_PENDING_APPROVAL]: [],
        [POLYGON_APPROVED]: [],
        [POLYGON_INFORMATION_REQUIRED]: [],
        [POLYGON_DRAFT]: []
      });
    }
  }, [polygonsData]);

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setCheckedValues([...checkedValues, value]);
    } else {
      setCheckedValues(checkedValues.filter(val => val !== value));
    }
  };

  const isSitesPolygonPanelEnabled = type === "sites" && !disabledPolygonPanel;

  const isMapLoading = useMemo(
    () => loading || (polygonsData.length > 0 && isPolygonTilesLoading),
    [loading, polygonsData.length, isPolygonTilesLoading]
  );

  const validationType = useMemo(() => {
    if (!isSitesPolygonPanelEnabled) return "";
    return editPolygon.isOpen ? "individualValidation" : "bulkValidation";
  }, [isSitesPolygonPanelEnabled, editPolygon.isOpen]);

  const validationStatus = useMemo(
    () => isSitesPolygonPanelEnabled && (stateViewPanel || editPolygon.isOpen),
    [isSitesPolygonPanelEnabled, stateViewPanel, editPolygon.isOpen]
  );

  return (
    <AnrMapOverlayProvider>
      {!disabledPolygonPanel && (
        <MapPolygonPanel
          title={type === "sites" ? t("Site Polygons") : t("Polygons")}
          items={(polygonsData ?? []) as SitePolygonLightDto[]}
          mapFunctions={mapFunctions}
          polygonsData={polygonDataMap}
          className="absolute z-[19] flex h-full w-[29vw] flex-col rounded-l bg-[#ffffff12] p-6 mobile:w-[30vw] mobile:px-1"
          emptyText={t("No polygons are available.")}
          checkedValues={checkedValues}
          onCheckboxChange={handleCheckboxChange}
          setSortOrder={setSortField}
          sortField={sortField}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          type={type}
          onSelectItem={() => {}}
          onLoadMore={() => {}}
          stateViewPanel={stateViewPanel}
          setStateViewPanel={setStateViewPanel}
          tabEditPolygon={tabEditPolygon}
          setTabEditPolygon={setTabEditPolygon}
          recallEntityData={refetch}
          polygonVersionData={polygonVersionData}
          refetchPolygonVersions={refetchPolygonVersions}
          refreshEntity={refreshEntity}
          entityUuid={entityModel?.uuid}
        />
      )}
      <Box
        position="relative"
        className={classNames(
          "w-full",
          disabledPolygonPanel && "overflow-hidden",
          !disabledPolygonPanel && "h-full flex-1",
          className
        )}
      >
        <LoadingMap loading={isMapLoading} />
        <MapContainer
          showBaseMapControl={false}
          championsMap={true}
          mapFunctions={mapFunctions}
          polygonsData={polygonDataMap}
          bbox={extentBbox}
          tooltipType={disabledPolygonPanel ? "view" : type === "sites" ? "edit" : "goTo"}
          showPopups
          showLegend
          siteData={true}
          status={validationStatus}
          validationType={validationType}
          record={entityModel}
          className={classNames(
            "flex-1",
            disabledPolygonPanel ? "h-full rounded" : "h-[650px] rounded-r-lg wide:h-[1225px]"
          )}
          polygonsExists={polygonsData.length > 0}
          setPolygonFromMap={setPolygonFromMap}
          polygonFromMap={polygonFromMap}
          shouldBboxZoom={!shouldRefetchPolygonData}
          mediaFiles={mediaFiles}
          sitePolygonData={sitePolygonDataV3}
          disabledPolygonPanel={disabledPolygonPanel}
          hideFullscreenControl={hideFullscreenControl}
          hideMediaPopupActions={disabledPolygonPanel}
          isPolygonGeometryLoading={isMapLoading}
          onPolygonTilesLoadingChange={setIsPolygonTilesLoading}
          overviewPolygonPopup={overviewPolygonPopup}
        />
      </Box>
    </AnrMapOverlayProvider>
  );
};

export default OverviewMapArea;
