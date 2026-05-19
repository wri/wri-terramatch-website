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
import { useValueChanged } from "@/hooks/useValueChanged";

import { parsePolygonDataV3, storePolygon } from "../utils";

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
  polygons: SitePolygonLightDto[];
  onRefetchPolygons: () => void | Promise<void>;
  className?: string;
  polygonTableHighlight?: {
    hoveredPolygonUuid: string | null;
    selectedPolygonUuids: string[];
    onHoveredPolygonFromMap?: (uuid: string | null) => void;
    onPolygonClickedFromMap?: (uuid: string) => void;
  };
  overlapPolygons?: OverlapPolygonPoint[];
}

const EMPTY_POLYGON_MAP: Record<string, string[]> = {
  [POLYGON_PENDING_APPROVAL]: [],
  [POLYGON_APPROVED]: [],
  [POLYGON_INFORMATION_REQUIRED]: [],
  [POLYGON_DRAFT]: []
};

type PolygonGeometryFeature = Pick<GeoJSON.Feature, "geometry">;

const PolygonsMap: FC<PolygonsMapProps> = ({
  entityModel,
  type,
  polygons,
  onRefetchPolygons,
  className,
  polygonTableHighlight,
  overlapPolygons
}) => {
  const disabledPolygonPanel = true;
  const [polygonDataMap, setPolygonDataMap] = useState<Record<string, string[]>>(() => ({ ...EMPTY_POLYGON_MAP }));
  const [polygonFromMap, setPolygonFromMap] = useState<PolygonFromMapState>({ isOpen: false, uuid: "" });

  const context = useSitePolygonData();
  const reloadSiteData = context?.reloadSiteData;

  const {
    editPolygon,
    shouldRefetchPolygonData,
    setSelectedPolygonsInCheckbox,
    setPolygonData,
    shouldRefetchValidation,
    setShouldRefetchValidation,
    setShouldRefetchPolygonData,
    polygonData: sitePolygonDataV3
  } = useMapAreaContext();

  const onSave = useCallback(
    (geojson: unknown, _record: unknown) => {
      if (!Array.isArray(geojson)) return;
      void storePolygon(geojson as PolygonGeometryFeature[], entityModel, setPolygonFromMap, onRefetchPolygons);
    },
    [entityModel, onRefetchPolygons, setPolygonFromMap]
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
    if (polygons.length > 0) {
      return modelBbox as BBox | undefined;
    }
    return countryBbox as BBox | undefined;
  }, [polygons.length, modelBbox, countryBbox]);

  useEffect(() => {
    setPolygonData(polygons);
  }, [polygons, setPolygonData]);

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
        polygonsExists={polygons.length > 0}
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
