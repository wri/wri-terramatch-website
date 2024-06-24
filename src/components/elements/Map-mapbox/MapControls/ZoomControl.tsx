import mapboxgl from "mapbox-gl";

import IconButton from "@/components/elements/IconButton/IconButton";
import ControlButtonsGroup from "@/components/elements/Map-mapbox/components/ControlButtonsGroup";
import ControlDivider from "@/components/elements/Map-mapbox/components/ControlDivider";
import { IconNames } from "@/components/extensive/Icon/Icon";

export const ZoomControl = ({ map }: { map: mapboxgl.Map | null }) => {
  return (
    <ControlButtonsGroup direction="col" className="z-10 w-auto">
      <IconButton
        iconProps={{
          name: IconNames.ZoomIn,
          width: 24,
          height: 24
        }}
        onClick={() => map?.zoomIn()}
        className="rounded-b-none rounded-t-lg p-[10px]"
        aria-label="Zoom in"
      />
      <ControlDivider direction="horizontal" className="m-0 w-auto bg-neutral-200" />
      <IconButton
        iconProps={{
          name: IconNames.ZoomOut,
          width: 24,
          height: 24
        }}
        onClick={() => map?.zoomOut()}
        className="rounded-t-none rounded-b-lg p-[10px]"
        aria-label="Zoom out"
      />
    </ControlButtonsGroup>
  );
};
