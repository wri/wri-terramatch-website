import { Box } from "@chakra-ui/react";
import { ComponentProps, FC, useMemo, useState } from "react";

import LoadingMap from "@/components/elements/Map-mapbox/components/LoadingMap";
import { usePolygonMapEditing } from "@/components/elements/Map-mapbox/hooks/usePolygonMapEditing";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import type { PolygonEntityScope } from "@/components/elements/Map-mapbox/Map.d";
import { useBoundingBox } from "@/connections/BoundingBox";
import { SitePolygonMapIndexFilter, useSitePolygonMapIndex } from "@/connections/SitePolygons";
import { DELETED_AUDIT_POLYGONS } from "@/constants/statuses";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";
import { ProjectMapEntryDto, SitePolygonMapEntryDto } from "@/generated/v3/researchService/researchServiceSchemas";
import ResizeBox from "@/redesignComponents/containers/ResizableSplitView/ResizableBox";

import PolygonDrawUndoButton from "../../site/[uuid]/components/PolygonDrawUndoButton";
import { getPolygonMapEditClassName } from "../../site/[uuid]/components/polygonMapEditLayout";
import { SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS } from "../../site/[uuid]/constants/sitePolygonMapSizing";
import { usePolygonDrawUndo } from "../../site/[uuid]/hooks/usePolygonDrawUndo";
import { useProjectMapMedia } from "../hooks/useProjectMapMedia";
import { getProjectMarkersBbox, toProjectMarkerPoints } from "../utils/projectMarkers";

const NO_POLYGONS: SitePolygonMapEntryDto[] = [];

type PolygonReviewMapProps = {
  projects: ProjectMapEntryDto[];
  selectedProject: ProjectMapEntryDto | null;
  siteUuids: string[];
  polygonFilter: SitePolygonMapIndexFilter;
  polygonTableHighlight: ComponentProps<typeof MapContainer>["polygonTableHighlight"];
  showDeleted?: boolean;
  onViewProjectPolygons: (projectUuid: string) => void;
  onRefetchPolygons: () => Promise<void>;
};

/**
 * Shows the project markers until a project is picked, then the project's polygons that match the Level 2 filters.
 * Polygons come from the GeoServer tiles filtered by the project's map index, so only the sparse index is fetched.
 * Editing a polygon works as on the site polygon map (see PolygonsMap), which shares usePolygonMapEditing.
 */
const PolygonReviewMap: FC<PolygonReviewMapProps> = ({
  projects,
  selectedProject,
  siteUuids,
  polygonFilter,
  polygonTableHighlight,
  showDeleted = false,
  onViewProjectPolygons,
  onRefetchPolygons
}) => {
  const projectUuid = selectedProject?.uuid;
  const { isOpen: isEditPolygonOpen } = usePolygonEditDrawer();
  const { editPolygon, isUserDrawingEnabled } = useMapAreaContext();
  const { mapFunctions, polygonFromMap, setPolygonFromMap, sitePolygonData, autoEditPolygon, isRefetchingPolygonData } =
    usePolygonMapEditing(onRefetchPolygons);

  const { showPolygonUndoButton, handleUndoPolygonDraw } = usePolygonDrawUndo({
    isEditPolygonOpen,
    isUserDrawingEnabled,
    isExistingPolygonOpen: editPolygon.isOpen && editPolygon.uuid !== ""
  });

  const polygonEntityScope = useMemo<PolygonEntityScope | undefined>(
    () => (projectUuid == null ? undefined : { entityName: "projects", entityUuid: projectUuid }),
    [projectUuid]
  );

  const [, { data: polygonMapIndex, loadFailure: polygonLoadFailure }] = useSitePolygonMapIndex({
    entityName: "projects",
    entityUuid: projectUuid,
    siteUuids,
    filter: polygonFilter,
    enabled: projectUuid != null
  });
  const projectPolygons = polygonMapIndex?.polygons;
  const mediaFiles = useProjectMapMedia({ projectUuid, siteUuids });

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

  return (
    <ResizeBox
      initialHeight={SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS}
      minHeight={SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS}
      maxHeight={600}
    >
      <Box position="relative" flex="1" className={getPolygonMapEditClassName(isEditPolygonOpen, true)}>
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
          sitePolygonData={sitePolygonData}
          polygonEntityScope={polygonEntityScope}
          polygonFromMap={polygonFromMap}
          setPolygonFromMap={setPolygonFromMap}
          autoEditPolygon={autoEditPolygon}
          shouldBboxZoom={!isRefetchingPolygonData}
          showLegend
          mediaFiles={mediaFiles}
          disabledPolygonPanel
          className="h-full w-full flex-1"
        />
      </Box>
      {showPolygonUndoButton && !showDeleted && <PolygonDrawUndoButton onUndo={handleUndoPolygonDraw} />}
    </ResizeBox>
  );
};

export default PolygonReviewMap;
