import { useT } from "@transifex/react";
import { FC, useMemo } from "react";

import { useBaseMap } from "@/components/elements/Map-mapbox/hooks/useBaseMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import { useProjectMapIndex } from "@/connections/ProjectMapIndex";
import ResizeBox from "@/redesignComponents/containers/ResizableSplitView/ResizableBox";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";

import { SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS } from "../../site/[uuid]/constants/sitePolygonMapSizing";
import { getProjectMarkersBbox, toProjectMarkerPoints } from "../utils/projectMarkers";

const PolygonReviewMap: FC = () => {
  const t = useT();
  const mapFunctions = useBaseMap();
  const [, { data: mapIndex, loadFailure }] = useProjectMapIndex({});

  const projectMarkers = useMemo(() => toProjectMarkerPoints(mapIndex?.projects ?? []), [mapIndex]);
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
      {loadFailure != null && (
        <InlineMessage variant="error" label={t("Unable to load projects")} caption={t("Please reload the page.")} />
      )}
    </>
  );
};

export default PolygonReviewMap;
