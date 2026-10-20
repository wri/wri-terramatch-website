import { useT } from "@transifex/react";
import { FC, useMemo } from "react";

import { useBaseMap } from "@/components/elements/Map-mapbox/hooks/useBaseMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import { ProjectMapEntryDto } from "@/generated/v3/researchService/researchServiceSchemas";
import ResizeBox from "@/redesignComponents/containers/ResizableSplitView/ResizableBox";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";

import { SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS } from "../../site/[uuid]/constants/sitePolygonMapSizing";
import { getProjectMarkersBbox, toProjectMarkerPoints } from "../utils/projectMarkers";

type PolygonReviewMapProps = {
  projects: ProjectMapEntryDto[];
  hasLoadFailure: boolean;
};

const PolygonReviewMap: FC<PolygonReviewMapProps> = ({ projects, hasLoadFailure }) => {
  const t = useT();
  const mapFunctions = useBaseMap();

  const projectMarkers = useMemo(() => toProjectMarkerPoints(projects), [projects]);
  const bbox = useMemo(() => getProjectMarkersBbox(projectMarkers), [projectMarkers]);

  return (
    <>
      <ResizeBox
        initialHeight={SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS}
        minHeight={SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS}
        maxHeight={600}
      >
        <MapContainer
          mapFunctions={mapFunctions}
          bbox={bbox}
          projectMarkers={projectMarkers}
          showLegend
          disabledPolygonPanel
          className="h-full w-full flex-1 !rounded-[0.25rem_0.25rem_0_0]"
        />
      </ResizeBox>
      {hasLoadFailure && (
        <InlineMessage variant="error" label={t("Unable to load projects")} caption={t("Please reload the page.")} />
      )}
    </>
  );
};

export default PolygonReviewMap;
