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
