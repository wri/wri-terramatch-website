import { Map as MapboxMap } from "mapbox-gl";
import type { FC } from "react";

import IconButton from "@/components/elements/IconButton/IconButton";
import { useChampionsMap } from "@/components/elements/Map-mapbox/championsMap.context";
import ControlButtonsGroup from "@/components/elements/Map-mapbox/components/ControlButtonsGroup";
import ControlDivider from "@/components/elements/Map-mapbox/components/ControlDivider";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { CheckIndeterminateIcon, CompressIcon, ExpandIcon, PlusIcon } from "@/redesignComponents/foundations/Icons";
import MapControls from "@/redesignComponents/geospatial/MapControls/MapControls";

type ZoomControlProps = {
  map: MapboxMap | null;
  isFullscreen?: boolean;
  toggleFullscreen: () => void;
};

export const ZoomControl: FC<ZoomControlProps> = ({ map, isFullscreen, toggleFullscreen }) => {
  if (useChampionsMap()) {
    return (
      <MapControls
        defaultGaps
        items={[
          {
            ariaLabel: "zoom in",
            gap: false,
            icon: <PlusIcon />,
            label: "zoom in",
            onClick: () => map?.zoomIn()
          },
          {
            ariaLabel: "zoom out",
            icon: <CheckIndeterminateIcon />,
            label: "zoom out",
            onClick: () => map?.zoomOut()
          },
          {
            ariaLabel: isFullscreen ? "Shrink" : "Expand",
            icon: isFullscreen ? <CompressIcon /> : <ExpandIcon />,
            onClick: toggleFullscreen,
            label: isFullscreen ? "Shrink" : "Expand"
          }
        ]}
        vertical
      />
    );
  }
  return (
    <ControlButtonsGroup direction="col" className="z-10 w-auto">
      <IconButton
        iconProps={{
          name: IconNames.ZoomIn,
          className: "h-6 w-6"
        }}
        onClick={() => map?.zoomIn()}
        className="h-10 w-10 rounded-b-none rounded-t-sm border border-neutral-175 bg-white p-2"
        aria-label="Zoom in"
      />
      <ControlDivider direction="horizontal" className="m-0 w-auto bg-neutral-200" />
      <IconButton
        iconProps={{
          name: IconNames.ZoomOut,
          className: "h-6 w-6"
        }}
        onClick={() => map?.zoomOut()}
        className="h-10 w-10 rounded-t-none rounded-b-sm border border-neutral-175 bg-white p-2"
        aria-label="Zoom out"
      />
    </ControlButtonsGroup>
  );
};
