import SemanticZoomBreadcrumb from "./SemanticZoomBreadcrumb";
import SemanticZoomMap from "./SemanticZoomMap";
import SemanticZoomPanel from "./SemanticZoomPanel";
import { useSemanticZoom, UseSemanticZoomOptions } from "./useSemanticZoom";

/**
 * Map beside panel, for a caller that has one rectangle to fill.
 *
 * The project Overview tab does not use this: it places the map and the panel in two separate
 * cards, driving both from `useSemanticZoom` directly. This composition stays for standalone
 * placements and keeps the pieces exercised as a whole.
 */
export type SemanticZoomContainerProps = UseSemanticZoomOptions;

const SemanticZoomContainer = (props: SemanticZoomContainerProps) => {
  const zoom = useSemanticZoom(props);

  return (
    <div className="flex w-full flex-col gap-3">
      <SemanticZoomBreadcrumb zoom={zoom} />

      <div className="flex w-full flex-col gap-3 ws-1100:flex-row">
        <div className="flex min-h-[420px] w-full flex-1 flex-col gap-1">
          <SemanticZoomMap zoom={zoom} />
        </div>

        <div className="min-h-[420px] w-full shrink-0 ws-1100:w-[400px]">
          <SemanticZoomPanel zoom={zoom} />
        </div>
      </div>
    </div>
  );
};

export default SemanticZoomContainer;
