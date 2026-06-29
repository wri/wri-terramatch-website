import { useT } from "@transifex/react";
import { TabBar } from "@worldresources/wri-design-systems";
import classNames from "classnames";
import { Map as MapboxMap } from "mapbox-gl";

import { useChampionsMap } from "@/components/elements/Map-mapbox/championsMap.context";
import ControlButtonsGroup from "@/components/elements/Map-mapbox/components/ControlButtonsGroup";
import ControlDivider from "@/components/elements/Map-mapbox/components/ControlDivider";
import { MapStyle } from "@/components/elements/Map-mapbox/MapControls/types";
import { GoogleViewIcon, MapViewIcon, SatelliteViewIcon } from "@/redesignComponents/foundations/Icons";

import { setMapStyle } from "../utils";

const styleToValue = (style: MapStyle): string => {
  if (style === MapStyle.Street) return "street";
  if (style === MapStyle.GoogleSatellite) return "google-satellite";
  return "satellite";
};

const championsStyleTabs = [
  {
    icon: <SatelliteViewIcon boxSize={4} />,
    label: "Satellite",
    value: "satellite"
  },
  {
    icon: <GoogleViewIcon boxSize={4} />,
    label: "Google",
    value: "google-satellite"
  },
  {
    icon: <MapViewIcon boxSize={4} />,
    label: "Map",
    value: "street"
  }
];

export const StyleControl = ({
  map,
  currentStyle,
  setCurrentStyle
}: {
  map: MapboxMap;
  currentStyle: MapStyle;
  setCurrentStyle: (style: MapStyle) => void;
}) => {
  const t = useT();
  const championsMap = useChampionsMap();

  const buttonBaseClass = "h-fit px-3 py-2 border border-neutral-175 bg-white whitespace-nowrap";
  const activeClass = "text-body-500 font-medium";
  const inactiveClass = "text-body-400";
  if (championsMap) {
    const selectedStyleValue = styleToValue(currentStyle);

    return (
      <TabBar
        key={selectedStyleValue}
        defaultValue={selectedStyleValue}
        tabs={championsStyleTabs}
        onTabClick={(value: string) => {
          const targetStyle =
            value === "street"
              ? MapStyle.Street
              : value === "google-satellite"
              ? MapStyle.GoogleSatellite
              : MapStyle.Satellite;
          setMapStyle(targetStyle, map, setCurrentStyle, currentStyle);
        }}
        variant="view"
      />
    );
  }
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
