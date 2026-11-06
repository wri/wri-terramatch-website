import type { ComponentProps, FC } from "react";

import PolygonsMap from "@/components/elements/Map-mapbox/components/PolygonsMap";
import type {
  CrossSiteOverlapPolygon,
  OverlapPolygonPoint
} from "@/components/elements/Map-mapbox/layers/overlapTypes";
import type { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import type { SitePolygonMapEntryDto } from "@/generated/v3/researchService/researchServiceSchemas";
import ResizeBox from "@/redesignComponents/containers/ResizableSplitView/ResizableBox";

import { SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS } from "../constants/sitePolygonMapSizing";
import PolygonDrawUndoButton from "./PolygonDrawUndoButton";
import { getPolygonMapEditClassName } from "./polygonMapEditLayout";

type SitePolygonMapSectionProps = {
  site: SiteFullDto;
  isAdmin: boolean;
  polygons: SitePolygonMapEntryDto[];
  isEditPolygonOpen: boolean;
  isSitePolygonsLoading: boolean;
  freezeCameraZoom?: boolean;
  skipNextSiteBboxZoomNonce?: number;
  polygonTableHighlight: ComponentProps<typeof PolygonsMap>["polygonTableHighlight"];
  overlapPolygons: OverlapPolygonPoint[];
  crossSiteOverlapPolygons?: CrossSiteOverlapPolygon[];
  onRefetchPolygons: ComponentProps<typeof PolygonsMap>["onRefetchPolygons"];
  showUndoButton: boolean;
  onUndoDraw: () => void;
  isDeletedAuditView?: boolean;
};

const SitePolygonMapSection: FC<SitePolygonMapSectionProps> = ({
  site,
  isAdmin,
  polygons,
  isEditPolygonOpen,
  isSitePolygonsLoading,
  freezeCameraZoom = false,
  skipNextSiteBboxZoomNonce = 0,
  polygonTableHighlight,
  overlapPolygons,
  crossSiteOverlapPolygons,
  onRefetchPolygons,
  showUndoButton,
  onUndoDraw,
  isDeletedAuditView = false
}) => {
  return (
    <ResizeBox
      initialHeight={SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS}
      minHeight={SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS}
      maxHeight={600}
    >
      <PolygonsMap
        entityModel={site}
        type="sites"
        className={getPolygonMapEditClassName(isEditPolygonOpen, isAdmin)}
        polygons={polygons}
        onRefetchPolygons={onRefetchPolygons}
        isLoadingPolygons={isSitePolygonsLoading}
        freezeCameraZoom={freezeCameraZoom}
        skipNextSiteBboxZoomNonce={skipNextSiteBboxZoomNonce}
        polygonTableHighlight={polygonTableHighlight}
        overlapPolygons={overlapPolygons}
        crossSiteOverlapPolygons={crossSiteOverlapPolygons}
        isDeletedAuditView={isDeletedAuditView}
      />
      {showUndoButton && !isDeletedAuditView && <PolygonDrawUndoButton onUndo={onUndoDraw} />}
    </ResizeBox>
  );
};

export default SitePolygonMapSection;
