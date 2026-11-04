import classNames from "classnames";
import { FC, useMemo, useState } from "react";

import LoadingMap from "@/components/elements/Map-mapbox/components/LoadingMap";
import { useBaseMap } from "@/components/elements/Map-mapbox/hooks/useBaseMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import { useBoundingBox } from "@/connections/BoundingBox";
import { SitePolygonMapIndexFilter, useSitePolygonMapIndex } from "@/connections/SitePolygons";
import { DELETED_AUDIT_POLYGONS } from "@/constants/statuses";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";
import { ProjectMapEntryDto, SitePolygonMapEntryDto } from "@/generated/v3/researchService/researchServiceSchemas";
import ResizeBox from "@/redesignComponents/containers/ResizableSplitView/ResizableBox";

import PolygonDrawUndoButton from "../../site/[uuid]/components/PolygonDrawUndoButton";
import { SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS } from "../../site/[uuid]/constants/sitePolygonMapSizing";
import { usePolygonDrawUndo } from "../../site/[uuid]/hooks/usePolygonDrawUndo";
import { getPolygonEditMapClassNames } from "../../site/[uuid]/utils/polygonEditMapClassNames";
import { getProjectMarkersBbox, toProjectMarkerPoints } from "../utils/projectMarkers";

const NO_POLYGONS: SitePolygonMapEntryDto[] = [];

type PolygonReviewMapProps = {
  projects: ProjectMapEntryDto[];
  selectedProject: ProjectMapEntryDto | null;
  siteUuids: string[];
  polygonFilter: SitePolygonMapIndexFilter;
  selectedPolygonUuids: string[];
  showDeleted?: boolean;
  onViewProjectPolygons: (projectUuid: string) => void;
};

/**
 * Shows the project markers until a project is picked, then the project's polygons that match the Level 2 filters.
 * Polygons come from the GeoServer tiles filtered by the project's map index, so only the sparse index is fetched.
 */
const PolygonReviewMap: FC<PolygonReviewMapProps> = ({
  projects,
  selectedProject,
  siteUuids,
  polygonFilter,
  selectedPolygonUuids,
  showDeleted = false,
  onViewProjectPolygons
}) => {
  const mapFunctions = useBaseMap(undefined, undefined, { deferDrawCreateSave: true });
  const projectUuid = selectedProject?.uuid;
  const { isOpen: isEditPolygonOpen } = usePolygonEditDrawer();
  const { isUserDrawingEnabled, editPolygon } = useMapAreaContext();
  const { showPolygonUndoButton, handleUndoPolygonDraw } = usePolygonDrawUndo({
    isEditPolygonOpen,
    isUserDrawingEnabled,
    isExistingPolygonOpen: editPolygon.isOpen && editPolygon.uuid !== ""
  });

  const [, { data: polygonMapIndex, loadFailure: polygonLoadFailure }] = useSitePolygonMapIndex({
    entityName: "projects",
    entityUuid: projectUuid,
    siteUuids,
    filter: polygonFilter,
    enabled: projectUuid != null
  });
  const projectPolygons = polygonMapIndex?.polygons;

  // Once the polygon layers are added, an empty list is needed to hide them when the project is cleared.
  const [hasPolygonLayers, setHasPolygonLayers] = useState(false);
  if (projectPolygons != null && !hasPolygonLayers) setHasPolygonLayers(true);

  const mapIndexPolygons = projectUuid != null ? projectPolygons : hasPolygonLayers ? NO_POLYGONS : undefined;

  const projectMarkers = useMemo(
    () => (selectedProject != null ? undefined : toProjectMarkerPoints(projects)),
    [projects, selectedProject]
  );
  const markersBbox = useMemo(
    () => getProjectMarkersBbox(toProjectMarkerPoints(selectedProject != null ? [selectedProject] : projects)),
    [projects, selectedProject]
  );
  // In the deleted audit view, zoom to the deleted polygons themselves (matches the site page), not the active ones.
  const deletedPolygonUuids = useMemo(() => {
    if (!showDeleted) return undefined;
    const uuids = (projectPolygons ?? [])
      .map(polygon => polygon.polygonUuid)
      .filter((uuid): uuid is string => uuid != null && uuid !== "");
    return uuids.length > 0 ? uuids : undefined;
  }, [showDeleted, projectPolygons]);
  const polygonsBbox = useBoundingBox(
    projectUuid == null
      ? {}
      : deletedPolygonUuids != null
      ? { polygonUuids: deletedPolygonUuids }
      : siteUuids.length > 0
      ? { siteUuids }
      : { projectUuid }
  );
  const bbox = (projectUuid != null ? polygonsBbox : undefined) ?? markersBbox;
  const polygonTableHighlight = useMemo(() => ({ selectedPolygonUuids }), [selectedPolygonUuids]);

  return (
    <ResizeBox
      initialHeight={SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS}
      minHeight={SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS}
      maxHeight={600}
    >
      <LoadingMap loading={projectUuid != null && projectPolygons == null && polygonLoadFailure == null} />
      <MapContainer
        championsMap
        mapFunctions={mapFunctions}
        bbox={bbox}
        projectMarkers={projectMarkers}
        onViewProjectPolygons={onViewProjectPolygons}
        mapIndexPolygons={mapIndexPolygons}
        mapPolygonsForcedStatus={showDeleted ? DELETED_AUDIT_POLYGONS : undefined}
        polygonTableHighlight={polygonTableHighlight}
        showLegend
        hideMediaOnMap
        disabledPolygonPanel
        // Polygon Review is admin-only, so the full-screen map always uses the admin offsets.
        className={classNames(
          "flex-1",
          { "overflow-hidden": isEditPolygonOpen },
          getPolygonEditMapClassNames(isEditPolygonOpen, true)
        )}
      />
      {showPolygonUndoButton && <PolygonDrawUndoButton onClick={handleUndoPolygonDraw} />}
    </ResizeBox>
  );
};

export default PolygonReviewMap;
