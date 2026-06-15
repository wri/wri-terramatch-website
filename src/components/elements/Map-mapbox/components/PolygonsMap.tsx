import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { type MapDrawSaveHandler, useBaseMap } from "@/components/elements/Map-mapbox/hooks/useBaseMap";
import { OverlapPolygonPoint } from "@/components/elements/Map-mapbox/layers/overlapTypes";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import type { PolygonFromMapState } from "@/components/elements/Map-mapbox/Map.d";
import { useBoundingBox } from "@/connections/BoundingBox";
import { SupportedEntity, useAllMedias } from "@/connections/EntityAssociation";
import {
  POLYGON_APPROVED,
  POLYGON_DRAFT,
  POLYGON_INFORMATION_REQUIRED,
  POLYGON_PENDING_APPROVAL
} from "@/constants/polygonStatuses";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { useValueChanged } from "@/hooks/useValueChanged";

import { getPolygonMapLoadingLabel, parsePolygonDataV3, storePolygon } from "../utils";
import LoadingMap from "./LoadingMap";

export type PolygonsMapEntityModel = {
  uuid: string;
  projectUuid?: string | null;
  projectCountry?: string | null;
  country?: string | null;
  organisation?: { name?: string };
};

type PolygonsMapEntityType = "sites" | "projects";

interface PolygonsMapProps {
  entityModel: PolygonsMapEntityModel;
  type: PolygonsMapEntityType;
  polygons: SitePolygonLightDto[];
  onRefetchPolygons: () => void | Promise<void>;
  isLoadingPolygons?: boolean;
  freezeCameraZoom?: boolean;
  className?: string;
  polygonTableHighlight?: {
    selectedPolygonUuids: string[];
    onPolygonClickedFromMap?: (uuid: string) => void;
    focusPolygonUuid?: string | null;
    onFocusPolygonConsumed?: () => void;
  };
  overlapPolygons?: OverlapPolygonPoint[];
}

const EMPTY_POLYGON_MAP: Record<string, string[]> = {
  [POLYGON_PENDING_APPROVAL]: [],
  [POLYGON_APPROVED]: [],
  [POLYGON_INFORMATION_REQUIRED]: [],
  [POLYGON_DRAFT]: []
};

const PolygonsMap: FC<PolygonsMapProps> = ({
  entityModel,
  type,
  polygons,
  onRefetchPolygons,
  isLoadingPolygons = false,
  freezeCameraZoom = false,
  className,
  polygonTableHighlight,
  overlapPolygons
}) => {
  const t = useT();
  const disabledPolygonPanel = true;
  const [polygonDataMap, setPolygonDataMap] = useState<Record<string, string[]>>(() => ({ ...EMPTY_POLYGON_MAP }));
  const [polygonFromMap, setPolygonFromMap] = useState<PolygonFromMapState>({ isOpen: false, uuid: "" });
  const [isPolygonTilesLoading, setIsPolygonTilesLoading] = useState(false);
  const { openNotification } = useNotificationContext();

  const context = useSitePolygonData();
  const reloadSiteData = context?.reloadSiteData;

  const {
    editPolygon,
    shouldRefetchPolygonData,
    shouldRefetchMediaData,
    setSelectedPolygonsInCheckbox,
    setPolygonData,
    setMediaFiles,
    shouldRefetchValidation,
    setShouldRefetchValidation,
    setShouldRefetchPolygonData,
    setShouldRefetchMediaData,
    polygonData: sitePolygonDataV3
  } = useMapAreaContext();

  const onSave = useCallback<MapDrawSaveHandler>(
    async geojson => {
      try {
        await storePolygon(geojson, entityModel, setPolygonFromMap, onRefetchPolygons);
      } catch (error) {
        const errorMessage =
          error != null && typeof error === "object" && "message" in error
            ? String(error.message)
            : t("Failed to create polygon");
        openNotification("error", t("Error"), errorMessage);
      }
    },
    [entityModel, onRefetchPolygons, openNotification, setPolygonFromMap, t]
  );

  const mapFunctions = useBaseMap(onSave, undefined, { deferDrawCreateSave: true });

  const [, { data: mediaFiles, refetch: refetchMediaFiles }] = useAllMedias({
    entity: type as SupportedEntity,
    uuid: entityModel.uuid,
    filter: {
      isGeotagged: true
    }
  });

  useEffect(() => {
    setMediaFiles(mediaFiles ?? []);
  }, [mediaFiles, setMediaFiles]);

  useValueChanged(shouldRefetchMediaData, () => {
    if (shouldRefetchMediaData) {
      refetchMediaFiles?.();
      setShouldRefetchMediaData(false);
    }
  });

  const modelBbox = useBoundingBox(
    type === "sites" ? { siteUuid: entityModel.uuid } : { projectUuid: entityModel.uuid }
  );

  const projectBbox = useBoundingBox(
    type === "sites" && entityModel.projectUuid != null && entityModel.projectUuid !== ""
      ? { projectUuid: entityModel.projectUuid }
      : {}
  );

  const countryBbox = useBoundingBox(
    type === "sites"
      ? { country: entityModel.projectCountry ?? undefined }
      : { country: entityModel.country ?? undefined }
  );

  const extentBbox = useMemo((): BBox | undefined => {
    if (modelBbox != null) {
      return modelBbox as BBox;
    }
    if (projectBbox != null) {
      return projectBbox as BBox;
    }
    if (type === "sites" && entityModel.projectUuid != null && entityModel.projectUuid !== "") {
      return undefined;
    }
    return countryBbox as BBox | undefined;
  }, [countryBbox, entityModel.projectUuid, modelBbox, projectBbox, type]);

  useEffect(() => {
    setPolygonData(polygons);
  }, [polygons, setPolygonData]);

  useEffect(() => {
    const { isOpen, uuid } = editPolygon;
    setPolygonFromMap({ isOpen, uuid });
    if (isOpen) {
      setSelectedPolygonsInCheckbox([]);
    }
  }, [editPolygon, setSelectedPolygonsInCheckbox]);

  useValueChanged(shouldRefetchPolygonData, async () => {
    if (shouldRefetchPolygonData) {
      await Promise.all([onRefetchPolygons(), reloadSiteData?.()]);
      setShouldRefetchPolygonData(false);
    }
  });

  useValueChanged(shouldRefetchValidation, () => {
    if (shouldRefetchValidation) {
      void onRefetchPolygons();
      setShouldRefetchValidation(false);
    }
  });

  useEffect(() => {
    if (polygons.length > 0) {
      const dataMap = parsePolygonDataV3(polygons);
      setPolygonDataMap(dataMap);
    } else {
      setPolygonDataMap({ ...EMPTY_POLYGON_MAP });
    }
  }, [polygons]);

  const isPolygonGeometryLoading = isLoadingPolygons || (polygons.length > 0 && isPolygonTilesLoading);

  return (
    <Box position="relative" className={classNames("h-full w-full flex-1", className)}>
      <LoadingMap text={getPolygonMapLoadingLabel(t, polygons.length)} loading={isPolygonGeometryLoading} />
      <MapContainer
        championsMap={true}
        mapFunctions={mapFunctions}
        polygonsData={polygonDataMap}
        bbox={extentBbox}
        tooltipType={type === "sites" ? "edit" : "goTo"}
        showPopups
        showLegend
        siteData={true}
        status={type === "sites" && !disabledPolygonPanel && editPolygon.isOpen}
        validationType={
          type === "sites" && !disabledPolygonPanel
            ? editPolygon.isOpen
              ? "individualValidation"
              : "bulkValidation"
            : ""
        }
        record={entityModel}
        className="h-full w-full flex-1"
        polygonsExists={polygons.length > 0}
        setPolygonFromMap={setPolygonFromMap}
        polygonFromMap={polygonFromMap}
        shouldBboxZoom={!shouldRefetchPolygonData && !freezeCameraZoom}
        mediaFiles={mediaFiles}
        sitePolygonData={sitePolygonDataV3}
        disabledPolygonPanel={disabledPolygonPanel}
        autoEditPolygon={editPolygon.isOpen}
        polygonTableHighlight={polygonTableHighlight}
        overlapPolygons={overlapPolygons}
        isPolygonGeometryLoading={isPolygonGeometryLoading}
        onPolygonTilesLoadingChange={setIsPolygonTilesLoading}
      />
    </Box>
  );
};

export default PolygonsMap;
