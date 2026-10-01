import { Box } from "@chakra-ui/react";
import classNames from "classnames";
import { type FC, useCallback, useEffect, useMemo, useState } from "react";

import { useBaseMap } from "@/components/elements/Map-mapbox/hooks/useBaseMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import type { PolygonEntityScope } from "@/components/elements/Map-mapbox/Map.d";
import { resolveMapExtentBbox, useBoundingBox } from "@/connections/BoundingBox";
import { useDelayedJobs } from "@/connections/DelayedJob";
import { SupportedEntity, useMedias } from "@/connections/EntityAssociation";
import { pruneSitePolygonsCache, useSitePolygonMapIndex } from "@/connections/SitePolygons";
import { AnrMapOverlayProvider } from "@/context/anrMapOverlay.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { useValueChanged } from "@/hooks/useValueChanged";

import { storePolygon } from "../utils";
import LoadingMap from "./LoadingMap";

type OverviewMapAreaProps = {
  entityModel: any;
  type: string;
  className?: string;
  hideFullscreenControl?: boolean;
  overviewPolygonPopup?: boolean;
};

const CLOSED_POLYGON_FROM_MAP = { isOpen: false, uuid: "" };

const OverviewMapArea: FC<OverviewMapAreaProps> = ({
  entityModel,
  type,
  className,
  hideFullscreenControl = false,
  overviewPolygonPopup = false
}) => {
  const [isPolygonTilesLoading, setIsPolygonTilesLoading] = useState(false);
  const [processedPolyValidationJobs, setProcessedPolyValidationJobs] = useState<Set<string>>(new Set());
  const context = useSitePolygonData();
  const reloadSiteData = context?.reloadSiteData;
  const entityType = type === "sites" ? "sites" : "projects";

  const {
    shouldRefetchPolygonData,
    setEditPolygon,
    setPolygonCriteriaMap,
    setPolygonData,
    shouldRefetchValidation,
    setShouldRefetchValidation,
    setShouldRefetchPolygonData,
    polygonData: sitePolygonDataV3,
    validFilter,
    setMediaFiles
  } = useMapAreaContext();

  const mapIndexFilter = useMemo(() => {
    const filter: Record<string, unknown> = {};
    if (validFilter != null && validFilter !== "" && validFilter !== "all") {
      filter["validationStatus[]"] = [validFilter];
    }
    return filter;
  }, [validFilter]);

  const [mapIndexLoaded, { data: mapIndex }] = useSitePolygonMapIndex({
    entityName: entityType,
    entityUuid: entityModel?.uuid,
    enabled: entityModel?.uuid != null && entityModel.uuid !== "",
    filter: mapIndexFilter
  });
  const mapPolygons = useMemo(() => mapIndex?.polygons ?? [], [mapIndex?.polygons]);

  const refetch = useCallback(() => {
    pruneSitePolygonsCache();
  }, []);

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

  useEffect(() => {
    setMediaFiles(mediaFiles ?? []);
  }, [mediaFiles, setMediaFiles]);

  const hasPolygons = (mapIndex?.total ?? 0) > 0;

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

  useEffect(() => {
    setPolygonCriteriaMap({});
    setPolygonData([]);
  }, [setPolygonCriteriaMap, setPolygonData]);

  const polygonEntityScope = useMemo<PolygonEntityScope | undefined>(
    () =>
      entityModel?.uuid != null && entityModel.uuid !== ""
        ? { entityName: entityType, entityUuid: entityModel.uuid }
        : undefined,
    [entityType, entityModel?.uuid]
  );

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

  const isMapLoading = useMemo(
    () => !mapIndexLoaded || (mapPolygons.length > 0 && isPolygonTilesLoading),
    [isPolygonTilesLoading, mapIndexLoaded, mapPolygons.length]
  );

  return (
    <AnrMapOverlayProvider>
      <Box position="relative" className={classNames("w-full overflow-hidden", className)}>
        <LoadingMap loading={isMapLoading} />
        <MapContainer
          showBaseMapControl={false}
          championsMap={true}
          mapFunctions={mapFunctions}
          mapIndexPolygons={mapPolygons}
          bbox={extentBbox}
          tooltipType="view"
          showPopups
          showLegend
          siteData={true}
          status={false}
          validationType=""
          record={entityModel}
          className="h-full flex-1 rounded"
          polygonsExists={hasPolygons}
          setPolygonFromMap={() => {}}
          polygonFromMap={CLOSED_POLYGON_FROM_MAP}
          shouldBboxZoom={!shouldRefetchPolygonData}
          mediaFiles={mediaFiles}
          sitePolygonData={sitePolygonDataV3}
          polygonEntityScope={polygonEntityScope}
          disabledPolygonPanel={true}
          hideFullscreenControl={hideFullscreenControl}
          hideMediaPopupActions={true}
          hideMediaOnMap
          isPolygonGeometryLoading={isMapLoading}
          onPolygonTilesLoadingChange={setIsPolygonTilesLoading}
          overviewPolygonPopup={overviewPolygonPopup}
        />
      </Box>
    </AnrMapOverlayProvider>
  );
};

export default OverviewMapArea;
