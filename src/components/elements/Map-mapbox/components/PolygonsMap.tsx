import { Box } from "@chakra-ui/react";
import classNames from "classnames";
import type { FC } from "react";
import { useMemo, useState } from "react";

import { useEntityMapMedia } from "@/components/elements/Map-mapbox/hooks/useEntityMapMedia";
import { usePolygonMapEditing } from "@/components/elements/Map-mapbox/hooks/usePolygonMapEditing";
import { CrossSiteOverlapPolygon, OverlapPolygonPoint } from "@/components/elements/Map-mapbox/layers/overlapTypes";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import type { PolygonEntityScope } from "@/components/elements/Map-mapbox/Map.d";
import { resolveMapExtentBbox, useBoundingBox } from "@/connections/BoundingBox";
import { DELETED_AUDIT_POLYGONS } from "@/constants/statuses";
import { SitePolygonMapEntryDto } from "@/generated/v3/researchService/researchServiceSchemas";

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
  polygons: SitePolygonMapEntryDto[];
  onRefetchPolygons: () => void | Promise<void>;
  isLoadingPolygons?: boolean;
  freezeCameraZoom?: boolean;
  skipNextSiteBboxZoomNonce?: number;
  className?: string;
  polygonTableHighlight?: {
    selectedPolygonUuids: string[];
    onPolygonClickedFromMap?: (uuid: string) => void;
    focusPolygonUuid?: string | null;
    onFocusPolygonConsumed?: () => void;
    validationZoomPolygonUuids?: string[] | null;
    onValidationZoomConsumed?: () => void;
  };
  overlapPolygons?: OverlapPolygonPoint[];
  crossSiteOverlapPolygons?: CrossSiteOverlapPolygon[];
  // Read-only audit mode for browsing soft-deleted polygons: renders every polygon with a single
  // ghost style regardless of prior status, and suppresses popups/tooltips since there are no
  // actions available on a deleted polygon.
  isDeletedAuditView?: boolean;
}

const PolygonsMap: FC<PolygonsMapProps> = ({
  entityModel,
  type,
  polygons,
  onRefetchPolygons,
  isLoadingPolygons = false,
  freezeCameraZoom = false,
  skipNextSiteBboxZoomNonce = 0,
  className,
  polygonTableHighlight,
  overlapPolygons,
  crossSiteOverlapPolygons,
  isDeletedAuditView = false
}) => {
  const disabledPolygonPanel = true;
  const [isPolygonTilesLoading, setIsPolygonTilesLoading] = useState(false);
  const { mapFunctions, polygonFromMap, setPolygonFromMap, sitePolygonData, autoEditPolygon, isRefetchingPolygonData } =
    usePolygonMapEditing(onRefetchPolygons);

  const mediaFiles = useEntityMapMedia({ entity: type, uuid: entityModel.uuid });

  const hasPolygons = polygons.length > 0;

  const polygonEntityScope = useMemo<PolygonEntityScope>(
    () => ({ entityName: type, entityUuid: entityModel.uuid }),
    [type, entityModel.uuid]
  );

  const deletedAuditPolygonUuids = useMemo(() => {
    if (!isDeletedAuditView) {
      return undefined;
    }
    const uuids = polygons
      .map(polygon => polygon.polygonUuid)
      .filter((uuid): uuid is string => uuid != null && uuid !== "");
    return uuids.length > 0 ? uuids : undefined;
  }, [isDeletedAuditView, polygons]);

  const modelBbox = useBoundingBox(
    deletedAuditPolygonUuids != null
      ? { polygonUuids: deletedAuditPolygonUuids }
      : type === "sites"
      ? { siteUuids: [entityModel.uuid] }
      : { projectUuid: entityModel.uuid }
  );

  const projectBbox = useBoundingBox(
    type === "sites" && !hasPolygons && entityModel.projectUuid != null && entityModel.projectUuid !== ""
      ? { projectUuid: entityModel.projectUuid }
      : {}
  );

  const countryBbox = useBoundingBox(
    hasPolygons
      ? {}
      : type === "sites"
      ? { country: entityModel.projectCountry ?? undefined }
      : { country: entityModel.country ?? undefined }
  );

  const extentBbox = useMemo(
    () =>
      resolveMapExtentBbox({
        entityType: type,
        hasPolygons,
        modelBbox,
        projectBbox,
        projectUuid: entityModel.projectUuid,
        countryBbox
      }),
    [countryBbox, entityModel.projectUuid, hasPolygons, modelBbox, projectBbox, type]
  );

  const isPolygonGeometryLoading = isLoadingPolygons || (polygons.length > 0 && isPolygonTilesLoading);

  return (
    <Box position="relative" className={classNames("h-full w-full flex-1", className)}>
      <LoadingMap loading={isPolygonGeometryLoading} />
      <MapContainer
        championsMap={true}
        mapFunctions={mapFunctions}
        mapIndexPolygons={polygons}
        mapPolygonsForcedStatus={isDeletedAuditView ? DELETED_AUDIT_POLYGONS : undefined}
        bbox={extentBbox}
        tooltipType={type === "sites" ? "edit" : "goTo"}
        showPopups={!isDeletedAuditView}
        showLegend
        siteData={true}
        status={type === "sites" && !disabledPolygonPanel && autoEditPolygon}
        validationType={
          type === "sites" && !disabledPolygonPanel ? (autoEditPolygon ? "individualValidation" : "bulkValidation") : ""
        }
        record={entityModel}
        className="h-full w-full flex-1"
        polygonsExists={polygons.length > 0}
        setPolygonFromMap={setPolygonFromMap}
        polygonFromMap={polygonFromMap}
        shouldBboxZoom={!isRefetchingPolygonData && !freezeCameraZoom}
        skipNextSiteBboxZoomNonce={skipNextSiteBboxZoomNonce}
        mediaFiles={mediaFiles}
        sitePolygonData={sitePolygonData}
        polygonEntityScope={polygonEntityScope}
        disabledPolygonPanel={disabledPolygonPanel}
        autoEditPolygon={autoEditPolygon}
        polygonTableHighlight={polygonTableHighlight}
        overlapPolygons={overlapPolygons}
        crossSiteOverlapPolygons={crossSiteOverlapPolygons}
        isPolygonGeometryLoading={isPolygonGeometryLoading}
        onPolygonTilesLoadingChange={setIsPolygonTilesLoading}
      />
    </Box>
  );
};

export default PolygonsMap;
