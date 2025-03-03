import { useT } from "@transifex/react";
import classNames from "classnames";
import mapboxgl from "mapbox-gl";

import ControlButtonsGroup from "@/components/elements/Map-mapbox/components/ControlButtonsGroup";
import ControlDivider from "@/components/elements/Map-mapbox/components/ControlDivider";
import { MapStyle } from "@/components/elements/Map-mapbox/MapControls/types";

import { setMapStyle } from "../utils";

export const StyleControl = ({
  map,
  currentStyle,
  setCurrentStyle
}: {
  map: mapboxgl.Map;
  currentStyle: MapStyle;
  setCurrentStyle: (style: MapStyle) => void;
}) => {
  const t = useT();
  return (
    <ControlButtonsGroup direction="row" className="h-auto">
      <button
        onClick={() => setMapStyle(MapStyle.Street, map, setCurrentStyle, currentStyle)}
        className={classNames(
          "h-fit w-21 rounded-l-lg py-2",
          currentStyle === MapStyle.Street ? "text-body-500" : "text-body-400"
        )}
        aria-label="Map street style"
      >
        {t("Map")}
      </button>
      <ControlDivider direction="vertical" className="m-0 h-auto bg-neutral-200" />
      <button
        onClick={() => setMapStyle(MapStyle.Satellite, map, setCurrentStyle, currentStyle)}
        className={classNames(
          "h-fit w-21 rounded-r-lg py-2",
          currentStyle === MapStyle.Satellite ? "text-body-500" : "text-body-400"
        )}
        aria-label="Map satellite style"
      >
        {t("Satellite")}
      </button>
    </ControlButtonsGroup>
  );
};
