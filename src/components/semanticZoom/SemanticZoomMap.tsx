import DrilldownMap from "./DrilldownMap";
import { SemanticZoom } from "./useSemanticZoom";

/** The map half of the drill-down. Selection comes from the hook, so the panel cannot disagree. */
const SemanticZoomMap = ({ zoom }: { zoom: SemanticZoom }) => (
  <DrilldownMap
    featureCollection={zoom.mapFeatures}
    selectedId={zoom.polygonUuid}
    loading={zoom.mapLoading}
    onSelectPolygon={zoom.selectFromMap}
  />
);

export default SemanticZoomMap;
