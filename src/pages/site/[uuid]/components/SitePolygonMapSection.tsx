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
  polygons: SitePolygonLightDto[];
  isEditPolygonOpen: boolean;
  isSitePolygonsLoading: boolean;
  polygonTableHighlight: ComponentProps<typeof PolygonsMap>["polygonTableHighlight"];
  overlapPolygons: OverlapPolygonPoint[];
  onRefetchPolygons: ComponentProps<typeof PolygonsMap>["onRefetchPolygons"];
  showUndoButton: boolean;
  onUndoDraw: () => void;
};

const SitePolygonMapSection: FC<SitePolygonMapSectionProps> = ({
  site,
  polygons,
  isEditPolygonOpen,
  isSitePolygonsLoading,
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
      className={classNames({
        "!h-[calc(100vh-66px)] w-screen": isEditPolygonOpen
      })}
    >
      <PolygonsMap
        entityModel={site}
        type="sites"
        className={classNames(
          "overflow-hidden",
          isEditPolygonOpen
            ? // TODO: Update `top-[70px]` when the navbar is redesigned so this offset matches the new header height.
              "!fixed top-[70px] bottom-0 left-0 right-0 z-[37] !h-[calc(100vh-66px)] w-screen rounded-none"
            : "h-full w-full !rounded-[0.25rem_0.25rem_0_0]"
        )}
        polygons={polygons}
        onRefetchPolygons={onRefetchPolygons}
        isLoadingPolygons={isSitePolygonsLoading}
        freezeCameraZoom={isSitePolygonsLoading}
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
