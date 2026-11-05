import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useEffect, useMemo, useState } from "react";

import LoadingMap from "@/components/elements/Map-mapbox/components/LoadingMap";
import { useBaseMap } from "@/components/elements/Map-mapbox/hooks/useBaseMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import type { PolygonEntityScope, PolygonFromMapState } from "@/components/elements/Map-mapbox/Map.d";
import { useBoundingBox } from "@/connections/BoundingBox";
import { SitePolygonMapIndexFilter, useSitePolygonMapIndex } from "@/connections/SitePolygons";
import { DELETED_AUDIT_POLYGONS } from "@/constants/statuses";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";
import { ProjectMapEntryDto, SitePolygonMapEntryDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ResizeBox from "@/redesignComponents/containers/ResizableSplitView/ResizableBox";
import UndoIcon from "@/redesignComponents/foundations/Icons/Function/UndoIcon";

import { SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS } from "../../site/[uuid]/constants/sitePolygonMapSizing";
import { usePolygonDrawUndo } from "../../site/[uuid]/hooks/usePolygonDrawUndo";
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
  const t = useT();
  const mapFunctions = useBaseMap();
  const projectUuid = selectedProject?.uuid;
  const { isOpen: isEditPolygonOpen } = usePolygonEditDrawer();
  const { editPolygon, isUserDrawingEnabled, polygonData } = useMapAreaContext();

  const [polygonFromMap, setPolygonFromMap] = useState<PolygonFromMapState>({ isOpen: false, uuid: "" });
  useEffect(() => {
    const { isOpen, uuid, status } = editPolygon;
    setPolygonFromMap({ isOpen, uuid, status });
  }, [editPolygon]);

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
      <Box
        position="relative"
        className={classNames("h-full w-full flex-1 overflow-hidden", {
          "!fixed top-0 bottom-0 left-0 right-0 z-[37] mt-12 ml-12 max-h-[calc(100vh_-_3rem)] w-screen max-w-[calc(100vw_-_3rem)] rounded-none":
            isEditPolygonOpen,
          "!rounded-[0.25rem_0.25rem_0_0]": !isEditPolygonOpen
        })}
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
          sitePolygonData={polygonData}
          polygonEntityScope={polygonEntityScope}
          polygonFromMap={polygonFromMap}
          setPolygonFromMap={setPolygonFromMap}
          autoEditPolygon={editPolygon.isOpen}
          showLegend
          hideMediaOnMap
          disabledPolygonPanel
          className="h-full w-full flex-1"
        />
      </Box>
      {showPolygonUndoButton && !showDeleted && (
        <Button
          variant="secondary"
          leftIcon={<UndoIcon />}
          className="fixed bottom-2 left-[calc(32rem+(100vw-32rem)/2)] z-[38] -translate-x-1/2"
          onClick={handleUndoPolygonDraw}
        >
          {t("Undo")}
        </Button>
      )}
    </ResizeBox>
  );
};

export default PolygonReviewMap;
