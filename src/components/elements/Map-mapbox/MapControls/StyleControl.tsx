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

  const buttonBaseClass = "h-fit px-3 py-2 border border-neutral-175 bg-white whitespace-nowrap";
  const activeClass = "text-body-500 font-medium";
  const inactiveClass = "text-body-400";

  return (
    <ControlButtonsGroup direction="row" className="h-auto">
      <button
        onClick={() => setMapStyle(MapStyle.GoogleSatellite, map, setCurrentStyle, currentStyle)}
        className={classNames(
          buttonBaseClass,
          "rounded-l",
          currentStyle === MapStyle.GoogleSatellite ? activeClass : inactiveClass
        )}
        aria-label="Google satellite style"
      >
        {t("Google")}
      </button>
      <ControlDivider direction="vertical" className="m-0 h-auto bg-neutral-200" />
      <button
        onClick={() => setMapStyle(MapStyle.Street, map, setCurrentStyle, currentStyle)}
        className={classNames(buttonBaseClass, currentStyle === MapStyle.Street ? activeClass : inactiveClass)}
        aria-label="Map street style"
      >
        {t("Map")}
      </button>
      <ControlDivider direction="vertical" className="m-0 h-auto bg-neutral-200" />
      <button
        onClick={() => setMapStyle(MapStyle.Satellite, map, setCurrentStyle, currentStyle)}
        className={classNames(
          buttonBaseClass,
          "rounded-r",
          currentStyle === MapStyle.Satellite ? activeClass : inactiveClass
        )}
        aria-label="Mapbox satellite style"
      >
        {t("Satellite")}
      </button>
    </ControlButtonsGroup>
  );
};
