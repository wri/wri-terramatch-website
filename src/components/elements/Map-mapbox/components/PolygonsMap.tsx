import classNames from "classnames";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { useBaseMap } from "@/components/elements/Map-mapbox/hooks/useBaseMap";
import { OverlapPolygonPoint } from "@/components/elements/Map-mapbox/layers/overlapTypes";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import type { PolygonFromMapState } from "@/components/elements/Map-mapbox/Map.d";
import { useBoundingBox } from "@/connections/BoundingBox";
import { SupportedEntity, useMedias } from "@/connections/EntityAssociation";
import { APPROVED, DRAFT, NEEDS_MORE_INFORMATION, SUBMITTED } from "@/constants/statuses";
import { AnrMapOverlayProvider } from "@/context/anrMapOverlay.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import useLoadSitePolygonsData from "@/hooks/paginated/useLoadSitePolygonData";
import { useValueChanged } from "@/hooks/useValueChanged";

import { parsePolygonDataV3, storePolygon } from "../utils";

/** Fields required for polygon loading, bbox, and `storePolygon` on this map. */
export type PolygonsMapEntityModel = {
  uuid: string;
  projectCountry?: string | null;
  country?: string | null;
  organisation?: { name?: string };
};

type PolygonsMapEntityType = "sites" | "projects";

interface PolygonsMapProps {
  entityModel: PolygonsMapEntityModel;
  type: PolygonsMapEntityType;
  className?: string;
  polygonsDataOverride?: SitePolygonLightDto[];
  polygonTableHighlight?: {
    hoveredPolygonUuid: string | null;
    selectedPolygonUuids: string[];
    onHoveredPolygonFromMap?: (uuid: string | null) => void;
    onPolygonClickedFromMap?: (uuid: string) => void;
  };
  overlapPolygons?: OverlapPolygonPoint[];
}

const EMPTY_POLYGON_MAP: Record<string, string[]> = {
  [SUBMITTED]: [],
  [APPROVED]: [],
  [NEEDS_MORE_INFORMATION]: [],
  [DRAFT]: []
};

type PolygonGeometryFeature = Pick<GeoJSON.Feature, "geometry">;

const PolygonsMap: FC<PolygonsMapProps> = ({
  entityModel,
  type,
  className,
  polygonsDataOverride,
  polygonTableHighlight,
  overlapPolygons
}) => {
  // Champions map keeps polygon panel disabled until edit/validation UX is migrated.
  const disabledPolygonPanel = true;
  const [polygonDataMap, setPolygonDataMap] = useState<Record<string, string[]>>(() => ({ ...EMPTY_POLYGON_MAP }));
  const [polygonFromMap, setPolygonFromMap] = useState<PolygonFromMapState>({ isOpen: false, uuid: "" });

  const context = useSitePolygonData();
  const reloadSiteData = context?.reloadSiteData;

  const {
    editPolygon,
    shouldRefetchPolygonData,
    setSelectedPolygonsInCheckbox,
    setPolygonCriteriaMap,
    setPolygonData,
    shouldRefetchValidation,
    setShouldRefetchValidation,
    setShouldRefetchPolygonData,
    polygonData: sitePolygonDataV3,
    validFilter
  } = useMapAreaContext();

  /** When parent passes `polygonsDataOverride`, skip `useAllSitePolygons` here to avoid duplicate loads. */
  const shouldFetchPolygons = polygonsDataOverride == null;

  const {
    data: fetchedPolygonsData,
    refetch,
    polygonCriteriaMap,
    loading
  } = useLoadSitePolygonsData(entityModel.uuid, type, "", "createdAt", "ASC", validFilter, shouldFetchPolygons);

  const polygonsData = polygonsDataOverride ?? fetchedPolygonsData;

  const onSave = useCallback(
    (geojson: unknown, _record: unknown) => {
      if (!Array.isArray(geojson)) return;
      void storePolygon(geojson as PolygonGeometryFeature[], entityModel, setPolygonFromMap, refetch);
    },
    [entityModel, refetch, setPolygonFromMap]
  );

  const mapFunctions = useBaseMap(onSave);

  const [, { data: mediaFiles }] = useMedias({
    entity: type as SupportedEntity,
    uuid: entityModel.uuid
  });

  const modelBbox = useBoundingBox(
    type === "sites" ? { siteUuid: entityModel.uuid } : { projectUuid: entityModel.uuid }
  );

  const countryBbox = useBoundingBox(
    type === "sites"
      ? { country: entityModel.projectCountry ?? undefined }
      : { country: entityModel.country ?? undefined }
  );

  const extentBbox = useMemo((): BBox | undefined => {
    if (polygonsDataOverride != null) {
      return modelBbox as BBox | undefined;
    }
    if (polygonsData.length > 0) {
      return modelBbox as BBox | undefined;
    }
    if (loading) {
      return modelBbox as BBox | undefined;
    }
    return countryBbox as BBox | undefined;
  }, [polygonsDataOverride, polygonsData, modelBbox, countryBbox, loading]);

  useValueChanged(loading, () => {
    setPolygonCriteriaMap(polygonCriteriaMap);
    setPolygonData(polygonsData);
  });

  useEffect(() => {
    if (polygonsDataOverride != null) {
      setPolygonData(polygonsDataOverride);
    }
  }, [polygonsDataOverride, setPolygonData]);

  useEffect(() => {
    if (polygonsDataOverride != null) return;
    void refetch();
  }, [validFilter, refetch, polygonsDataOverride]);

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
    if (polygonsData.length > 0) {
      const dataMap = parsePolygonDataV3(polygonsData);
      setPolygonDataMap(dataMap);
    } else {
      setPolygonDataMap({ ...EMPTY_POLYGON_MAP });
    }
  }, [polygonsData]);

  return (
    <AnrMapOverlayProvider>
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
        className={classNames("h-full w-full flex-1", className)}
        polygonsExists={polygonsData.length > 0}
        setPolygonFromMap={setPolygonFromMap}
        polygonFromMap={polygonFromMap}
        shouldBboxZoom={!shouldRefetchPolygonData}
        mediaFiles={mediaFiles}
        sitePolygonData={sitePolygonDataV3}
        disabledPolygonPanel={disabledPolygonPanel}
        polygonTableHighlight={polygonTableHighlight}
        overlapPolygons={overlapPolygons}
      />
    </AnrMapOverlayProvider>
  );
};

export default PolygonsMap;
