import SemanticZoomContainer, { SemanticZoomContainerProps } from "./SemanticZoomContainer";

export const SEMANTIC_ZOOM_TAB_KEY = "zoom";

/** Thin wrapper so the project page does not import the orchestrator directly. */
const SemanticZoomTab = (props: SemanticZoomContainerProps) => (
  // The project page drops tab bodies into a flex row, so without w-full/flex-1 this collapses to
  // its content width and the map never gets any room.
  <div className="w-full flex-1 p-4">
    <SemanticZoomContainer {...props} />
  </div>
);

export default SemanticZoomTab;
