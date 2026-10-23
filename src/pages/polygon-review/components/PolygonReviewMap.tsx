import { useT } from "@transifex/react";
import { FC, useMemo, useState } from "react";

import LoadingMap from "@/components/elements/Map-mapbox/components/LoadingMap";
import { useBaseMap } from "@/components/elements/Map-mapbox/hooks/useBaseMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import { useBoundingBox } from "@/connections/BoundingBox";
import { useSitePolygonMapIndex } from "@/connections/SitePolygons";
import { ProjectMapEntryDto, SitePolygonMapEntryDto } from "@/generated/v3/researchService/researchServiceSchemas";
import ResizeBox from "@/redesignComponents/containers/ResizableSplitView/ResizableBox";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";

import { SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS } from "../../site/[uuid]/constants/sitePolygonMapSizing";
import { getProjectMarkersBbox, toProjectMarkerPoints } from "../utils/projectMarkers";

const NO_POLYGONS: SitePolygonMapEntryDto[] = [];

type PolygonReviewMapProps = {
  projects: ProjectMapEntryDto[];
  selectedProject: ProjectMapEntryDto | null;
  hasLoadFailure: boolean;
  onViewProjectPolygons: (projectUuid: string) => void;
};

const PolygonReviewMap: FC<PolygonReviewMapProps> = ({
  projects,
  selectedProject,
  hasLoadFailure,
  onViewProjectPolygons
}) => {
  const t = useT();
  const mapFunctions = useBaseMap();
  const projectUuid = selectedProject?.uuid;

  const [, { data: polygonMapIndex, loadFailure: polygonLoadFailure }] = useSitePolygonMapIndex({
    entityName: "projects",
    entityUuid: projectUuid,
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
  const polygonsBbox = useBoundingBox(projectUuid != null ? { projectUuid } : {});
  const bbox = (projectUuid != null ? polygonsBbox : undefined) ?? markersBbox;

  return (
    <>
      <ResizeBox
        initialHeight={SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS}
        minHeight={SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS}
        maxHeight={600}
      >
        <LoadingMap loading={projectUuid != null && projectPolygons == null && polygonLoadFailure == null} />
        <MapContainer
          mapFunctions={mapFunctions}
          bbox={bbox}
          projectMarkers={projectMarkers}
          onViewProjectPolygons={onViewProjectPolygons}
          mapIndexPolygons={mapIndexPolygons}
          showLegend
          disabledPolygonPanel
          className="h-full w-full flex-1 !rounded-[0.25rem_0.25rem_0_0]"
        />
      </ResizeBox>
      {hasLoadFailure && (
        <InlineMessage variant="error" label={t("Unable to load projects")} caption={t("Please reload the page.")} />
      )}
      {polygonLoadFailure != null && (
        <InlineMessage variant="error" label={t("Unable to load polygons")} caption={t("Please reload the page.")} />
      )}
    </>
  );
};

export default PolygonReviewMap;
