import SemanticZoomContainer, { SemanticZoomContainerProps } from "./SemanticZoomContainer";

export const SEMANTIC_ZOOM_TAB_KEY = "zoom";

/** Thin wrapper so the project page does not import the orchestrator directly. */
const SemanticZoomTab = (props: SemanticZoomContainerProps) => (
  <div className="p-4">
    <SemanticZoomContainer {...props} />
  </div>
);

export default SemanticZoomTab;
