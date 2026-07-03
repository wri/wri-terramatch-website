import { useT } from "@transifex/react";
import classNames from "classnames";
import type { ComponentProps, FC } from "react";

import PolygonsMap from "@/components/elements/Map-mapbox/components/PolygonsMap";
import type { OverlapPolygonPoint } from "@/components/elements/Map-mapbox/layers/overlapTypes";
import type { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import type { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ResizeBox from "@/redesignComponents/containers/ResizableSplitView/ResizableBox";
import UndoIcon from "@/redesignComponents/foundations/Icons/Function/UndoIcon";

import { SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS } from "../constants/sitePolygonMapSizing";

type SitePolygonMapSectionProps = {
  site: SiteFullDto;
  isAdmin: boolean;
  polygons: SitePolygonLightDto[];
  isEditPolygonOpen: boolean;
  isSitePolygonsLoading: boolean;
  freezeCameraZoom?: boolean;
  skipNextSiteBboxZoomNonce?: number;
  polygonTableHighlight: ComponentProps<typeof PolygonsMap>["polygonTableHighlight"];
  overlapPolygons: OverlapPolygonPoint[];
  onRefetchPolygons: ComponentProps<typeof PolygonsMap>["onRefetchPolygons"];
  showUndoButton: boolean;
  onUndoDraw: () => void;
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
  onRefetchPolygons,
  showUndoButton,
  onUndoDraw
}) => {
  const t = useT();

  return (
    <ResizeBox
      initialHeight={SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS}
      minHeight={SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS}
      maxHeight={600}
    >
      <PolygonsMap
        entityModel={site}
        type="sites"
        className={classNames("overflow-hidden", {
          "!fixed top-0 bottom-0 left-0 right-0 z-[37] w-screen rounded-none": isEditPolygonOpen,
          "mt-12 ml-12 max-w-[calc(100vw_-_3rem)]": isEditPolygonOpen && isAdmin,
          "mt-[70px]": isEditPolygonOpen && !isAdmin,
          "h-full w-full !rounded-[0.25rem_0.25rem_0_0]": !isEditPolygonOpen
        })}
        polygons={polygons}
        onRefetchPolygons={onRefetchPolygons}
        isLoadingPolygons={isSitePolygonsLoading}
        freezeCameraZoom={freezeCameraZoom}
        skipNextSiteBboxZoomNonce={skipNextSiteBboxZoomNonce}
        polygonTableHighlight={polygonTableHighlight}
        overlapPolygons={overlapPolygons}
      />
      {showUndoButton && (
        <Button
          variant="secondary"
          leftIcon={<UndoIcon />}
          className="fixed bottom-2 left-[calc(32rem+(100vw-32rem)/2)] z-[38] -translate-x-1/2"
          onClick={onUndoDraw}
        >
          {t("Undo")}
        </Button>
      )}
    </ResizeBox>
  );
};

export default SitePolygonMapSection;
