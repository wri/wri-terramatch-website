import { useLocation } from "react-router-dom";

import IconButton from "@/components/elements/IconButton/IconButton";
import ControlButtonsGroup from "@/components/elements/Map-mapbox/components/ControlButtonsGroup";
import ControlDivider from "@/components/elements/Map-mapbox/components/ControlDivider";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { useMapContext } from "@/context/map.provider";
import { useMapSiteContext } from "@/context/mapSites.provider";

export const ZoomControl = () => {
  const location = useLocation();
  const path = location.pathname;
  const { map } = path.includes("show/1") ? useMapSiteContext() : useMapContext();

  return (
    <ControlButtonsGroup direction="col" className="w-auto">
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
